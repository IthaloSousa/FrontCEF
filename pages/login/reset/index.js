import React, { useState } from 'react'
import styles from '@/styles/reset.module.css'
import Image from 'next/image'
import axios from 'axios'
import { parseCookies } from 'nookies'
import Link from 'next/link'

const Reset = () => {

    const [error, setError] = useState();
    const [errorEmpty, setErrorEmpty] = useState();
    const [messageOk, setMessageOk] = useState();
    const [email, setEmail] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const URL = "https://backcef.up.railway.app"

    const sendMail = async (e) => {
        setIsLoading(true);

        e.preventDefault();
        const email = e.target.email.value;
        if (!email) {
            setErrorEmpty("Campo vazio, preencha-o para prosseguir")
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${URL}/api/reset/password/`, { email }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setMessageOk(response.data.success);
            const timeout = setTimeout(() => {
                setMessageOk('');
            }, 5000)
            setIsLoading(false);

            return () => clearTimeout(timeout);
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                setError(error.response.data?.error);
                const timeout = setTimeout(() => {
                    setError('');
                }, 2500)
                return () => clearTimeout(timeout);
            }
        }
    }

    const handleChange = (e) => {
        setEmail(e.target.value);
        setErrorEmpty('');
    }


    return (
        <div className={styles.reset_container}>
            <div className={styles.reset_card}>
                <div className={styles.reset_grid}>
                    <Image src={'/assets/images/logo2.jpg'} width={90} height={35} alt='Logo' />
                    <h3>Redefinição de Senha</h3>
                    <p>Para recuperar a senha digite o e-mail que você utilizou no cadastro</p>
                    <Image src={'/assets/images/password.svg'} width={200} height={200} alt='Password Image' />
                    <p>Vamos mandar um e-mail contendo um link para redefinição da senha. <strong>Verifique na caixa de spam do seu e-mail, caso não veja o link na caixa de entrada</strong></p>
                    {error ? <p className={styles.message_error}>{error}</p> : ''}
                    {messageOk ? <p className={styles.message_ok}>{messageOk}</p> : ''}
                    <form onSubmit={sendMail}>
                        <input type="email" name='email' onChange={handleChange} placeholder='Digite seu e-mail' />
                        {errorEmpty ? <label style={{ fontSize: 12, color: 'red', display: 'flex', justifyContent: 'flex-start', marginTop: 3 }}>{errorEmpty}</label> : ''}
                        {!isLoading ? <button type='submit' disabled={email ? false : true}>Enviar</button> : <Image style={{ marginTop: '10px' }} src={"/assets/images/loading.svg"} height={30} width={30} alt='Loading' />}
                    </form>
                    <Link className={styles.reset_back_login} href={"/login"}>Voltar</Link>
                </div>
            </div>
        </div>

    )
}

export const getServerSideProps = async (ctx) => {
    const { ['authTokens']: token } = parseCookies(ctx);
    if (token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}


export default Reset