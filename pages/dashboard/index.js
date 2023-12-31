/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import SideBarAdmin from '@/components/SideBarAdmin';
import jwtDecode from 'jwt-decode';
import { parseCookies } from 'nookies';
import styles from '@/styles/adminDashboard.module.css'
import Image from 'next/image';
import { AiOutlineDelete } from 'react-icons/ai'
import { FiEdit } from 'react-icons/fi'
import ModalDelete from '@/components/ModalDelete';

import { BsEye } from 'react-icons/bs'
import { BiCommentDetail } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import IconInfo from '@/components/IconInfo';
import useAxios from '@/services/useAxios';
import Pagination from '@/components/Pagination';
import ThreeDotMenuDashboard from '@/components/ThreeDotMenuDashboard';

function Admin() {
    const [isToggle, setIsToggle] = useState(true);
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState();
    const [messageOk, setMessageOk] = useState();
    const [deleteId, setDeleteId] = useState();
    const [options, setOptions] = useState();
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
    const [isVisible, setIsVisible] = useState(false);

    const { push } = useRouter();
    const router = useRouter();
    const currentPage = parseInt(router.query.page) || 1;

    const api = useAxios();
    const URL = "https://backcef.up.railway.app"


    const handleValueChange = (value) => {
        setIsToggle(value);
    }

    useEffect(() => {
        fetchItems();
    }, [currentPage])


    const fetchItems = async () => {
        try {
            const response = await axios.get(`${URL}/api/list_post/?page=${currentPage}&title=${title}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = response.data;

            setItems(data.results);
            setTotalPages(data.total_pages);
        } catch (error) {
            push('/404');
            console.error('Erro ao buscar itens:', error);
        }
    }


    const handlePageClick = (pageNumber) => {
        push(`/dashboard/?page=${pageNumber}`);
    };


    const handleOpenModal = (deleteId) => {
        setModal(true);
        setDeleteId(deleteId);
    }

    const handleCloseModal = () => {
        setModal(false);
    }

    const onSearchChange = (e) => {
        setTitle(e.target.value);
    }

    const handleOptions = (id) => {
        setOptions(id);
    }
    const handleOptionsLeave = () => {
        setOptions();
    }

    const handleVisibleMenu = () => {
        setIsVisible(!isVisible);
    }

    const deletePost = async (postId) => {
        try {
            const response = await api.delete(`${URL}/api/delete_post/${postId}`);
            setMessageOk(response.data.message)
            setModal(false);
            fetchItems();
            const interval = setTimeout(() => {
                setMessageOk('');
            }, 2500);
            return () => clearTimeout(interval);
        } catch (error) {
            if (error.response) {
                setError(error.response.data?.error);
                const interval = setTimeout(() => {
                    setError('');
                }, 2500);
                return () => clearTimeout(interval);
            }
        }
    }

    useEffect(() => {
        function handleResize() {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <>
            <SideBarAdmin onValueChange={handleValueChange} search={fetchItems} onSearchChange={onSearchChange} />

            <div className={`${styles.dashboard_container} ${!isToggle ? styles.dashboard_container_toggle : ''}`}>

                {messageOk ? <p className={styles.dashboard_messageOk}>{messageOk}</p> : ''}
                {error ? <p className={styles.dashboard_messageError}>{error}</p> : ''}
                {items.map((item) => {
                    return (
                        <div key={item.id} onMouseEnter={() => handleOptions(item.id)} onMouseLeave={handleOptionsLeave} className={styles.dashboard_card}>
                            <div className={styles.dashboard_card_container}>
                                <div className={styles.dashboard_image_container}>
                                    <img src={item.image_link != null ? item.image_link : '/assets/images/profile_photo.webp'} className={styles.dashboard_image} width={80} height={80} alt={'Image Dashboard'} />
                                    <div className={styles.dashboard_title_container}>
                                        <h3>{item.title}</h3>
                                        <p>{item.published_at === item.updated_at ? `Publicado • ${new Date(item.published_at).toLocaleString()}` : `Atualizado • ${new Date(item.updated_at).toLocaleString()}`}</p>
                                    </div>
                                </div>
                                <div className={styles.dashboard_options}>
                                    {screenSize.width > 1040 ? <div className={styles.dashboard_options_top}>
                                        
                                        <div style={{ display: options === item.id ? 'flex' : 'none', alignItems: 'center', gap: '10px' }}>
                                            <Link href={`/dashboard/edit/${item.id}`}>
                                                <IconInfo icon={<FiEdit className={styles.icon} />} iconText="Editar" />
                                            </Link>
                                            <IconInfo icon={<AiOutlineDelete className={styles.icon} onClick={() => handleOpenModal(item.id)} />} iconText="Apagar" />
                                            <Link href={`/noticias/${item.title.replace(/ /g, '-').replace('?', '')}/${item.id}`}><IconInfo icon={<BsEye className={styles.icon} />} iconText="Visualizar" /></Link>
                                        </div>
                                        <p style={{ display: options !== item.id ? 'flex' : 'none' }}>{item.user.nome} {item.user.sobrenome}</p>
                                    </div> : 
                                    <>
                                    <div style={{ width: 10, height: 10 }}>
                                        <BsThreeDotsVertical width={5} height={5} style={{ fontSize: 20 }} onClick={handleVisibleMenu} />
                                    </div>
                                    <ThreeDotMenuDashboard isVisible={isVisible} onEdit={() => push(`/dashboard/edit/${item.id}`)} onView={()=> push(`/noticias/${item.title.replace(/ /g, '-').replace('?', '')}/${item.id}`)} onDelete={()=> {handleOpenModal(item.id); handleVisibleMenu()}}/>
                                </>
                                }
                                    
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: "flex-end" }}>
                                        <p style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: '5px' }}>{item.comments.length}<BiCommentDetail /></p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                },)
                }
                <ModalDelete isOpen={modal} handleCloseModal={handleCloseModal} deletePost={() => deletePost(deleteId)}>
                    <h2>Excluir postagem</h2>
                    <p>Tem certeza que deseja excluir essa postagem? </p>
                </ModalDelete>
                <Pagination handlePageClick={handlePageClick} currentPage={currentPage} totalPages={totalPages} />
            </div>

        </>
    )
}

export const getServerSideProps = async (ctx) => {
    const { ['authTokens']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    const data = JSON?.parse(token);
    const tokenInfo = jwtDecode(data.access);
    if (!tokenInfo.isAdmin) {
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


export default Admin