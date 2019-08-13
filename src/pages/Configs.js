import React, { useEffect, useState } from 'react';
import db from '../fb'
import './Configs.css'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';

export default function(props){

    const { id, setarCor } = props;

    const [user, setUser] = useState({});

    const [cor, setCor] = useState('');
    const [limite, setLimite] = useState('');
    const [data, setData] = useState('');
    const [snackbar, setSnackbar] = useState(false);
    const [mensagemSnackbar, setMensagemSnackbar] = useState('');
    const [openDialogoExcluir, setOpenDialogoExcluir] = useState(false);

    useEffect(() => {
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setUser({id, ...snapshot.data()});
            setCor(snapshot.data().cor);
            setLimite(snapshot.data().limite);
            setData(snapshot.data().dataFatura);
        });
    }, []);

    function getTheme(){
        return createMuiTheme({
            palette: {
                secondary: {
                    main: "#aa0000"
                }
            }
        });
    }

    function handleSubmit(e){
        e.preventDefault();
        if(!isValidColor(cor)){
            setMensagemSnackbar('Cor inválida!');
            setSnackbar(true);
            return;
        }
        if(parseInt(limite) <= 0){
            setMensagemSnackbar('Limite inválido!');
            setSnackbar(true);
            return;
        }
        if(parseInt(data) < 1 || parseInt(data) > 31){
            setMensagemSnackbar('Data inválida!');
            setSnackbar(true);
            return;
        }
        db.collection('usuarios').doc(id).update({
            cor,
            dataFatura: parseInt(data),
            limite: parseInt(limite)
        }).then(() => {
            setMensagemSnackbar('Configurações salvas!');
            setSnackbar(true);
        });
        setarCor(cor);
    }
    
    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    }
    
    function isValidColor(str) {
        return str.match(/^#[a-f0-9]{6}$/i) !== null;
    }

    function excluirPerfil(){
        db.collection('gastos').where('usuario', '==', id).get().then((query) => {
            const batch = db.batch();
            query.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        });

        db.collection('usuarios').doc(id).delete().then(() => {
            props.navigate(`/`);
        });
    }

    return(
        <div className='containerConfigs'>
            <strong className='titulo'>Configurações</strong>
            <form onSubmit={handleSubmit}>
                <strong className='subtitulo'>Cor:</strong>
                <input type='text' placeholder='Cor em hexadecimal (#df440a)' onChange={e => setCor(e.target.value)} value={cor}></input>
                <strong className='subtitulo'>Limite:</strong>
                <input type='number' placeholder='Limite'onChange={e => setLimite(e.target.value)} value={limite}></input>
                <strong className='subtitulo'>Data de fechamento da fatura:</strong>
                <input type='number' placeholder='Dia do mês' onChange={e => setData(e.target.value)} value={data}></input>
                <button>Salvar</button>
            </form>
            <MuiThemeProvider theme={getTheme()}>
                <Fab style={{position: 'absolute', bottom: 20, right: 20}} color='secondary' onClick={() => setOpenDialogoExcluir(true)}>
                    <Icon>delete</Icon>
                </Fab>
            </MuiThemeProvider>
            <Dialog onClose={() => {setOpenDialogoExcluir(false)}} open={openDialogoExcluir}>
                <Card>
                    <div className='containerExcluir'>
                        <strong className='titulo'>Excluir perfil</strong>
                        <p>Tem certeza que deseja excluir esse perfil?</p>
                        <div className='containerBotoes'>
                            <button onClick={excluirPerfil} style={{backgroundColor: '#aa0000'}}>Sim</button>
                            <button onClick={() => {setOpenDialogoExcluir(false)}}>Não</button>
                        </div>
                    </div>
                </Card>
            </Dialog>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={snackbar}
                autoHideDuration={5000}
                onClose={handleClose}
                message={<span id="mensagemSnackbar">{mensagemSnackbar}</span>}
                action={[
                    <Button key="undo" color="secondary" size="small" onClick={handleClose}>
                        Fechar
                    </Button>
                ]}
            >
            </Snackbar>
        </div>
    );
}