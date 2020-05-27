import React, { useEffect, useState } from 'react';
import { FiPower, FiTrash } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api'
import './style.css';
import logoImg from '../../assets/logo.svg';

export default function Profile() {
    const history = useHistory();

    const [incidents, setIncidents] = useState([]);
    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');

    useEffect(() => {
        api.get('profile', {
            headers: {
            Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDelteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });
            setIncidents(incidents.filter( incident => incident.id != id));
        } catch (error) {
            alert('Erro ao deletar o caso, tente novamente')
        }

    }
    function handleLogout(){
        localStorage.clear();

        history.push('/')

    }
    
    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the Hero" />
                <span>Bem vindo, {ongName}</span>

                <Link className="button" to="incident/new">Cadastrar novo caso </Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                    <strong>CASP:</strong>
                    <p>{incident.title}</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>{incident.description}</p>

                    <strong>VALOR:</strong>
                    <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                    <button onClick={() => handleDelteIncident(incident.id)} type="button">
                        <FiTrash size={20} color="#a8a8b3"/>
                    </button>
                </li>
                ))}
            </ul>

        </div>

    );
}