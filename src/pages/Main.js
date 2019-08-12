import React, { useState, useEffect } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Router } from "@reach/router"
import Configs from './Configs'
import Extrato from './Extrato'
import Graficos from './Graficos'
import AdicionarGasto from './AdicionarGasto'
import db from '../fb'
import './Main.css'

export default function Main(props) {

    const { id } = props;
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({cor: '#ffffff'});

    useEffect(() => {
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setUser({id, ...snapshot.data()});
        });
    }, [id]);


    function getTheme(){
        return createMuiTheme({
            palette: {
                secondary: {
                    main: user.cor
                }
            }
        });
    }

    function abrirMenu() {
        setOpen(true);
    }

    function fecharMenu() {
        setOpen(false);
    }

    return (
        <div className='divMain'>
            <MuiThemeProvider theme={getTheme()}>
                <AppBar position="static" color='secondary'>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={abrirMenu}>
                            <Icon>menu</Icon>
                        </IconButton>
                        <Typography variant="h6">
                            Controle de Gastos
                        </Typography>
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
            <Router className='routerMain'>
                <AdicionarGasto path='gasto' id={id}></AdicionarGasto>
                <Extrato path='extrato' id={id}></Extrato>
                <Graficos path='graficos' id={id}></Graficos>
                <Configs path='configs' id={id}></Configs>
            </Router>
            <SwipeableDrawer open={open} onClose={fecharMenu} onOpen={abrirMenu}>
                <div className='containerMenu'>
                    <List onClick={fecharMenu} onKeyDown={fecharMenu}>
                        <ListItem button onClick={() => {props.navigate(`/${id}/gasto`)}}>
                            <ListItemIcon>
                                <Icon>attach_money</Icon>
                            </ListItemIcon>
                            <ListItemText>Adicionar Gasto</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => {props.navigate(`/${id}/extrato`)}}>
                            <ListItemIcon>
                                <Icon>list</Icon>
                            </ListItemIcon>
                            <ListItemText>Extrato</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => {props.navigate(`/${id}/graficos`)}}>
                            <ListItemIcon>
                                <Icon>timeline</Icon>
                            </ListItemIcon>
                            <ListItemText>Gráficos</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => {props.navigate(`/${id}/configs`)}}>
                            <ListItemIcon>
                                <Icon>settings</Icon>
                            </ListItemIcon>
                            <ListItemText>Configurações</ListItemText>
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => props.navigate(`/`)}>
                            <ListItemIcon>
                                <Icon>backspace</Icon>
                            </ListItemIcon>
                            <ListItemText>Sair</ListItemText>
                        </ListItem>
                    </List>
                </div>
            </SwipeableDrawer>
        </div>
    );
}