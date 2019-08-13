import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import db from '../fb'
import './Fatura.css'

export default function (props) {
    const { id } = props;

    const [cor, setCor] = useState({ color: '#000000' });
    const [user, setUser] = useState('');
    const [limite, setLimite] = useState(0);
    const [faturaAtual, setFaturaAtual] = useState(0);
    const [gastos, setGastos] = useState([]);
    const [somaGastos, setSomaGastos] = useState(0);
    const [bal, setBal] = useState(0);

    useEffect(() => {
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setUser({ id, ...snapshot.data() });
            setLimite(snapshot.data().limite);
        });
    }, [id]);

    useEffect(() => {
        let soma = 0;
        gastos.forEach(gasto => {
            soma += gasto.valor;
        })
        setSomaGastos(soma);
        setBal(limite - soma);
        if (soma > limite) {
            setCor({ color: '#990000' })
        } else setCor({ color: '#007519' });
    }, [gastos]);

    useEffect(() => {
        if (user) {
            db.collection('gastos')
                .where('data', '>=', getDataFatura('inicial'))
                .where('data', '<=', getDataFatura('final'))
                .where('usuario', '==', user.id)
                .get().then((snapshot) => {
                    let _gastos = [];
                    snapshot.docs.forEach(doc => {
                        const id = doc.id;
                        const gasto = { id, ...doc.data() }
                        _gastos = [..._gastos, gasto];
                    });
                    setGastos(_gastos);
                });
        }
    }, [user]);

    function getDataFatura(tipo) {
        const { dataFatura } = user;
        const date = new Date();
        const dia = date.getDate();
        let mes = date.getMonth() + 1;
        let ano = date.getFullYear();

        if (tipo === 'inicial') {
            if (dia < dataFatura) {
                mes--;
                if (mes === 0) {
                    mes = 12;
                    ano--;
                }
            }
        } else if (tipo === 'final') {
            if (dia > dataFatura) {
                mes++;
                if (mes === 13) {
                    mes = 1;
                    ano++;
                }
            }
        } else {
            console.log('qq ce fez ai parceria?');
        }
        return new Date(`${mes}-${dataFatura}-${ano}`);
    }

    function getDataString(date){
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }

    return (
        <div className='faturaContainer'>
            <Card>
                <div className='containerCardFatura'>
                    <strong className='titulo'>Fatura</strong>
                    <strong className='subtitulo'>Período: </strong>
                    <p>{getDataString(getDataFatura('inicial'))} até {getDataString(getDataFatura('final'))}</p>
                    <strong className='subtitulo'>Limite: </strong>
                    <p>R${limite.toFixed(2)}</p>
                    <strong className='subtitulo'>Valor: </strong>
                    <p>R${somaGastos.toFixed(2)}</p>
                    <strong className='subtitulo'>Balanço: </strong>
                    <p style={cor}>R${bal.toFixed(2)}</p>
                </div>
            </Card>
        </div>
    );
}