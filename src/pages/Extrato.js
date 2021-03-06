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
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function (props) {

    const { id } = props;

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const anos = [2019, 2020, 2021]

    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [user, setUser] = useState('');
    const [gastos, setGastos] = useState([]);
    const [gastoDetalhes, setGastoDetalhes] = useState({id: 0, desc: '', valor: 1, data: ''});
    const [openDetalhes, setOpenDetalhes] = useState(false);
    const [openSelectAno, setOpenSelectAno] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        setMes(meses[new Date().getMonth()]);
        setAno(new Date().getYear()+1900);
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setUser({id, ...snapshot.data()});
        });
    }, []);

    useEffect(() => {
        if(mes && ano && user){
            console.log(getDataFinal());
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
        return new Date(`${meses.indexOf(mes) + 1}-01-${ano}`);
    }

    function getDataFinal(){
        let data = new Date(`${meses.indexOf(mes) + 1}-31-${ano}`);
        data.setHours(23);
        data.setMinutes(59);
        data.setSeconds(59);
        return data;
    }

    function getSomaTotal(){
        let soma = 0;
        gastos.forEach(gasto => {
            soma += gasto.valor;
        });
        return soma;
    }

    function showGasto(gasto){
        setGastoDetalhes(gasto);
        setOpenDetalhes(true);
    }

    function excluirGastoDetalhe(){
        db.collection('gastos').doc(gastoDetalhes.id).delete();
        let _gastos = gastos.filter(gasto => gasto.id != gastoDetalhes.id);
        setGastos(_gastos);
        setOpenDetalhes(false);
        setOpenSnackbar(true);
    }

    function getStringData(timestamp){
        if(gastoDetalhes.id === 0) return;
        const date = new Date(timestamp.seconds * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    function handleCloseSnackbar(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
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
                        open={openSelectAno}
                        onClose={() => setOpenSelectAno(false)}
                        onOpen={() => setOpenSelectAno(true)}
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
                            <div key={gasto.id} onClick={() => {showGasto(gasto)}}>
                                <ListItem className='listItemContainer'>
                                    <span className='valor'>R${gasto.valor.toFixed(2)}</span>
                                    <span className='desc'>{gasto.desc}</span>
                                </ListItem>
                                <Divider />
                            </div>
                        ))
                    }
                    <ListItem className='listItemContainer'>
                        <span className='valorSoma'>R${getSomaTotal().toFixed(2)}</span>
                        <span className='descSoma'>Soma total</span>
                    </ListItem>
                </List>
            </Card>
            <Dialog onClose={() => {setOpenDetalhes(false)}} open={openDetalhes}>
                <Card>
                    <div className='containerCardDetalhes'>
                    <strong className='titulo'>Gasto</strong>
                        <strong className='subtitulo'>Valor: </strong>
                        <p>R${gastoDetalhes.valor.toFixed(2)}</p>
                        <strong className='subtitulo'>Descrição: </strong>
                        <p>{gastoDetalhes.desc}</p>
                        <strong className='subtitulo'>Data: </strong>
                        <p>{getStringData(gastoDetalhes.data)}</p>
                        <div className='botao'>
                            <button onClick={() => excluirGastoDetalhe()}>Excluir</button>
                        </div>
                    </div>
                </Card>
            </Dialog>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                message={<span id="mensagemSnackbar">Gasto excluido!</span>}
                action={[
                    <Button key="undo" color="secondary" size="small" onClick={handleCloseSnackbar}>
                      Fechar
                    </Button>
                  ]}
            >
            </Snackbar>
        </div>
    );
}