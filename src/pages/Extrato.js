import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import db from '../fb'
import './Extrato.css'
import SnapshotState from 'jest-snapshot/build/State';

export default function (props) {

    const { id } = props;

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const anos = [2019, 2020, 2021]

    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [user, setUser] = useState('');
    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        setMes(meses[new Date().getMonth()]);
        setAno(new Date().getYear()+1900);
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setUser({id, ...snapshot.data()});
        });
    }, []);

    useEffect(() => {
        if(mes && ano && user){
            db.collection('gastos')
            .where('data', '>=', getDataInicial())
            .where('data', '<=', getDataFinal())
            .where('usuario', '==', user.id)
            .get().then((snapshot) => {
                let _gastos = [];
                snapshot.docs.forEach(doc => {
                    const id = doc.id;
                    const gasto = {id, ...doc.data()}
                    _gastos = [..._gastos, gasto];
                });
                setGastos(_gastos);
            });
        }
    }, [mes, ano, user]);

    function handleChangeMes(event){
        setMes(event.target.value);
    }

    function handleChangeAno(event){
        setAno(event.target.value);
    }

    function getDataInicial(){
        return new Date(`${ano}-${meses.indexOf(mes) + 1}-01`);
    }

    function getDataFinal(){
        return new Date(`${ano}-${meses.indexOf(mes) + 1}-31`);
    }

    function getSomaTotal(){
        let soma = 0;
        gastos.forEach(gasto => {
            console.log(gasto.valor);
            soma += gasto.valor;
        });
        return soma;
    }

    return (
        <div className='extratoContainer'>
            <div className='containerInputs'>
                <FormControl className='formulario' style={{ margin: '20px', minWidth: '100px' }}>
                    <InputLabel htmlFor="mes-input">Mês</InputLabel>
                    <Select
                        value={mes}
                        onChange={handleChangeMes}
                        inputProps={{
                            name: 'mes',
                            id: 'mes-input',
                        }}
                    >
                        {
                            meses.map((m) => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl className='formulario' style={{ margin: '20px', minWidth: '100px' }}>
                    <InputLabel htmlFor="ano-input">Ano</InputLabel>
                    <Select
                        value={ano}
                        onChange={handleChangeAno}
                        inputProps={{
                            name: 'ano',
                            id: 'ano-input',
                        }}
                    >
                        {
                            anos.map((m) => (
                                <MenuItem key={m} value={m}>{m}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
            <Card className='cardContainer' style={{ overflow: 'visible' }}>
                <List className='listContainer'>
                    {
                        gastos.map(gasto => (
                            <div key={gasto.id}>
                                <ListItem className='listItemContainer'>
                                    <span className='valor'>R${gasto.valor}</span>
                                    <span className='desc'>{gasto.desc}</span>
                                </ListItem>
                                <Divider />
                            </div>
                        ))
                    }
                    <ListItem className='listItemContainer'>
                        <span className='valorSoma'>R${getSomaTotal()}</span>
                        <span className='descSoma'>Soma total</span>
                    </ListItem>
                </List>
            </Card>
        </div>
    );
}