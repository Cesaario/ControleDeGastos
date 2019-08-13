import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { navigate } from "@reach/router"
import './DialogoRegistro.css'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import db from '../fb';

export default function (props) {

    const { open, onClose, addUser } = props;

    const [nome, setNome] = useState('');
    const [limite, setLimite] = useState('');
    const [data, setData] = useState('');
    const [cor, setCor] = useState('');
    const [senha, setSenha] = useState('');
    const [snackbar, setSnackbar] = useState(false);
    const [mensagemSnackbar, setMensagemSnackbar] = useState('');

    useEffect(() => {
        setCor(makeRandomColor());
    }, []);

    function handleRegister(e) {
        e.preventDefault();
        if (nome.length === 0) {
            setMensagemSnackbar('Nome inválido!');
            setSnackbar(true);
            return;
        }
        if (senha.length === 0) {
            setMensagemSnackbar('Senha inválida!');
            setSnackbar(true);
            return;
        }
        if (parseInt(limite) <= 0) {
            setMensagemSnackbar('Limite inválido!');
            setSnackbar(true);
            return;
        }
        if (parseInt(data) < 1 || parseInt(data) > 31) {
            setMensagemSnackbar('Data inválida!');
            setSnackbar(true);
            return;
        }
        if (!isValidColor(cor)) {
            //setMensagemSnackbar('Cor inválida!');
            //setSnackbar(true);
            //return;
            setCor(makeRandomColor());
        }
        let user = {
            nome,
            dataFatura: parseInt(data),
            limite: parseInt(limite),
            cor,
            senha: senha
        };
        db.collection('usuarios').add(user).then((doc) => {
            const id = doc.id;
            user = { ...user, id };
            addUser(user);
            setMensagemSnackbar('Perfil criado com sucesso!');
            setSnackbar(true);
            onClose();
            navigate(`/${id}/gasto`);
            console.log('Fazendo login como: ', id);
        });
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

    function makeRandomColor() {
        let c = '';
        while (c.length < 6) {
            c += (Math.random()).toString(16).substr(-6).substr(-1)
        }
        return '#' + c;
    }

    return (
        <div>
            <Dialog onClose={onClose} open={open}>
                <div className='containerCriarConta'>
                    <strong className='titulo'>Criar novo perfil</strong>
                    <form onSubmit={handleRegister}>
                        <strong className='subtitulo'>Nome:</strong>
                        <input type='text' placeholder='Nome' onChange={e => setNome(e.target.value)} value={nome}></input>
                        <strong className='subtitulo'>Limite:</strong>
                        <input type='number' placeholder='Limite' onChange={e => setLimite(e.target.value)} value={limite}></input>
                        <strong className='subtitulo'>Dia do fechamento da fatura:</strong>
                        <input type='number' placeholder='Dia do mês' onChange={e => setData(e.target.value)} value={data}></input>
                        <strong className='subtitulo'>Senha:</strong>
                        <input type='number' placeholder='Senha' onChange={e => setSenha(e.target.value)} value={senha} style={{ WebkitTextSecurity: "disc" }}></input>
                        <button>Criar</button>
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

/*
                        <strong className='subtitulo'>Cor:</strong>
                        <input type='text' placeholder='Cor (#df440a)' onChange={e => setCor(e.target.value)} value={cor}></input>
*/