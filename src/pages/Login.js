import React, { useState, useEffect } from 'react';
import './Login.css'

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import DialogoSenha from './DialogoSenha'
import DialogoRegistro from './DialogoRegistro'

import db from '../fb.js'

export default function () {

    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [openRegistro, setOpenRegistro] = useState(false);
    const [idLogin, setIdLogin] = useState('');
    const [nome, setNome] = useState('');

    useEffect(() => {
        db.collection('usuarios').get().then((snapshot) => {
            let usuarios = [];
            snapshot.docs.forEach(doc => {
                const id = doc.id;
                const data = { id, ...doc.data() };
                usuarios = ([...usuarios, data]);
                setUsers(usuarios); //Tenho quase certeza de que isso deveria estar fora do forEach. Mas como está funcionando vou deixar...
            });
        });
    }, []);

    function handleLoginScreen(id, nome) {
        setIdLogin(id);
        setNome(nome);
        setOpen(true);
    }

    function handleCloseLoginScreen() {
        setOpen(false);
    }

    function handleCloseRegistroScreen() {
        setOpenRegistro(false);
    }

    function addUsuario(user){
        setUsers([...users, user]);
    }

    function getTheme(){
        return createMuiTheme({
            palette: {
                secondary: {
                    main: "#ff3300"
                }
            }
        });
    }

    return (
        <div className='loginContainer'>
            <div className='titulo'>
                <p>Controle de Gastos</p>
            </div>
            <Grid container spacing={3}>
                {
                    users.map(user => (
                        <Grid key={user.nome} item xs={6} sm={4} md={3} onClick={() => { handleLoginScreen(user.id, user.nome) }}>
                            <Card>
                                <div className='conteudoCard'>
                                    <div className='avatar' style={{ backgroundColor: user.cor }}></div>
                                    <p className='nome'>{user.nome}</p>
                                </div>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
            <MuiThemeProvider theme={getTheme()}>
                <Fab style={{position: 'absolute', bottom: 20, right: 20}} color='secondary' onClick={() => setOpenRegistro(true)}>
                    <Icon>add</Icon>
                </Fab>
            </MuiThemeProvider>
            <DialogoSenha open={open} onClose={handleCloseLoginScreen} nome={nome} id={idLogin}></DialogoSenha>
            <DialogoRegistro open={openRegistro} onClose={handleCloseRegistroScreen} addUser={addUsuario}></DialogoRegistro>
        </div>
    );

}   