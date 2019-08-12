import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { navigate } from "@reach/router"
import './DialogoSenha.css'

export default function(props) {
    const { open, onClose, nome, id} = props;
    const [senha, setSenha] = useState('');

    function handleLogin(e){
        e.preventDefault();
        navigate(`/${id}/gasto`);
        console.log('Fazendo login como: ', id);
    }

    return (
        <Dialog onClose={onClose} open={open}>
            <div className='containerTitulo'>
                <p>Faça login como {nome}</p>
            </div>
            <div className='loginContainer'>
                <form onSubmit={handleLogin}>
                    <input className='inputSenha' type='number' placeholder='Digite sua senha'></input>
                    <button>Login</button>
                </form>
            </div>
        </Dialog>
    );
}