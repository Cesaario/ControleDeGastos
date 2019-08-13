import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { navigate } from "@reach/router"
import './DialogoSenha.css'
import db from '../fb'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function (props) {

    const { open, onClose, nome, id } = props;
    const [senha, setSenha] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');
    const [snackbar, setSnackbar] = useState(false);
    const [mensagemSnackbar, setMensagemSnackbar] = useState('');

    function handleLogin(e) {
        e.preventDefault();
        if (parseInt(senha) === senhaUsuario) {
            navigate(`/${id}/gasto`);
            console.log('Fazendo login como: ', id);
        } else {
            setMensagemSnackbar('Senha incorreta');
            setSnackbar(true);
            setSenha('');
        }
    }

    useEffect(() => {
        if (!id) return;
        db.collection('usuarios').doc(id).get().then((snapshot) => {
            setSenhaUsuario(snapshot.data().senha);
        });
    }, [id]);
    
    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(false);
    }

    return (
        <div>
            <Dialog onClose={onClose} open={open}>
                <div className='containerTitulo'>
                    <p>Faça login como {nome}</p>
                </div>
                <div className='loginContainer'>
                    <form onSubmit={handleLogin}>
                        <input className='inputSenha' type='number' placeholder='Digite sua senha' style={{ WebkitTextSecurity: "disc" }} onChange={e => setSenha(e.target.value)} value={senha}></input>
                        <button>Login</button>
                    </form>
                </div>
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