import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import db from '../fb';
import './Graficos.css'

export default function(props){

    const { id } = props;

    const respostaGastos = [];
    const arrayMeses = [];

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const [user, setUser] = useState('');
    const [dataDonut, setDataDonut] = useState({});
    const [dataBarra, setDataBarra] = useState({});

    const [somaGastosFatura, setSomaGastosFatura] = useState(0);

    useEffect(() => {
        if (!id) return;
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setUser({id, ...snapshot.data()});
        });
    }, [id]);

    useEffect(() => {
        if(user){
            getGastoFatura();
            getGastosMensais();
        }
    }, [user]);

    useEffect(() => {
        getNewDataDonut(somaGastosFatura);
    }, [somaGastosFatura]);

    function getGastoFatura(){
        db.collection('gastos')
        .where('data', '>=', getDataFatura('inicial'))
        .where('data', '<=', getDataFatura('final'))
        .where('usuario', '==', user.id)
        .get().then((snapshot) => {
            let _somaGastos = 0;
            snapshot.docs.forEach(doc => {
                _somaGastos += doc.data().valor;
            });
            setSomaGastosFatura(_somaGastos);
        });
    }

    function getGastosMensais(){
        const mes = new Date().getMonth() + 1;
        let ano = new Date().getFullYear();
        for(let i = mes - 4; i <= mes; i++){
            let _mes = i;
            if(_mes <= 0){
                _mes = 12 - _mes;
                ano--;
            }
            db.collection('gastos')
            .where('data', '>=', getDataInicial(_mes, ano))
            .where('data', '<=', getDataFinal(_mes, ano))
            .where('usuario', '==', user.id)
            .get().then((snapshot) => {
                let _somaGastos = 0;
                snapshot.docs.forEach(doc => {
                    _somaGastos += doc.data().valor;
                });
                respostaGastos.push(_somaGastos);
                if(respostaGastos.length === 5){
                    getArrayMeses();
                    getNewDataBarra();
                }
            });
        }
    }

    function getDataInicial(_mes, ano){
        return new Date(`${_mes}-01-${ano}`);
    }

    function getDataFinal(_mes, ano){
        let data = new Date(`${_mes}-31-${ano}`);
        data.setHours(23);
        data.setMinutes(59);
        data.setSeconds(59);
        return data;
    }

    function getNewDataDonut(somaGastos){
        const newDataDonut = {
            labels: [
                'Total dos Gastos',
                'Limite Restante'
            ],
            datasets: [{
                data: [somaGastos, getSaldoRestante(somaGastos)],
                backgroundColor: [
                '#aa0000',
                '#007519',
                ]
            }]
        }
        setDataDonut(newDataDonut);
    }

    function getSaldoRestante(somaGastos){
        return user.limite - somaGastos > 0 ? user.limite - somaGastos : 0;
    }

    function getNewDataBarra(){
        console.log(arrayMeses);
        const newDataBarra = {
            labels: arrayMeses,
            datasets: [{
                data: respostaGastos,
                backgroundColor: [
                    '#3949AB',
                    '#3949AB',
                    '#3949AB',
                    '#3949AB',
                    '#3949AB'
                ],
                backgroundColorBorder:[
                    '#1A237E',
                    '#1A237E',
                    '#1A237E',
                    '#1A237E',
                    '#1A237E',
                ],
                borderWidth: 2,
                label: 'Gastos Mensais'
            }]
        }
        setDataBarra(newDataBarra);
    }

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

    function getArrayMeses(){
        const mes = new Date().getMonth() + 1;
        for(let i = mes - 5; i < mes; i++){
            arrayMeses.push(meses[i]);
        }
    }

    function getDataString(date){
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }

    return(
        <div className='containerGraficos'>
            <strong>Fatura</strong>
            <strong className='subtitulo'>{getDataString(getDataFatura('inicial'))} até {getDataString(getDataFatura('final'))}</strong>
            <Doughnut data={dataDonut}></Doughnut>
            <strong>Gasto mensal</strong>
            <Bar data={dataBarra}></Bar>
        </div>
    );
}