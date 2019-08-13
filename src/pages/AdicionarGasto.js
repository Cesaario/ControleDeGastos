import React, { useState } from 'react';
import firebase from 'firebase/app';
import db from '../fb';

import './AdicionarGasto.css'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default function (props) {

    const { id } = props;

    const [valor, setValor] = useState('');
    const [desc, setDesc] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        console.log();
        const gasto = {
            data: firebase.firestore.FieldValue.serverTimestamp(),
            desc,
            valor: Number(valor.replace(/,/g, ".")),
            usuario: id
        }
        db.collection('gastos').add(gasto).then(() => {
            setOpenSnackbar(true);
        });
        setValor('');
        setDesc('');
    }

    function converterValor(val) {
        return val; //Number(val.replace(/,/g, "."));
    }

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }

    return (
        <div className='containerAdicionarGasto'>
            <strong>Adicionar novo gasto</strong>
            <form onSubmit={handleSubmit}>
                <input type='number' placeholder='Valor' required onChange={e => setValor(converterValor(e.target.value))} value={valor}></input>
                <input type='text' placeholder='Descrição' onChange={e => setDesc(e.target.value)} value={desc}></input>
                <button>Adicionar</button>
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleClose}
                message={<span id="mensagemSnackbar">Gasto adicionado!</span>}
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