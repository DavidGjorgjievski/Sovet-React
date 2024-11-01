import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/TopicDetails.css';

function TopicDetails() {
    const navigate = useNavigate();
    const { id, idt } = useParams();
    const [userData] = useState(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        return storedUserInfo ? JSON.parse(storedUserInfo) : {};
    });
    const [topicDetails, setTopicDetails] = useState(null);
    const jwtToken = localStorage.getItem('jwtToken') || '';

    useEffect(() => {
        const fetchTopicDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/topics/details/${idt}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch topic details');
                }
                const data = await response.json();
                setTopicDetails(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTopicDetails();
    }, [navigate, id, idt, jwtToken]);

    return (
        <div className="topic-details-container">
            <HelmetProvider>
                <Helmet>
                    <title>Детални резултати</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
            <Header userInfo={userData} />
            <main className='topic-details-body-container'>
                <div className="detailed-result-header">
                    <div className="detailed-result-button-container">
                        <button onClick={() => navigate(`/sessions/${id}/topics#topic-${idt}`)} className="back-button">Назад</button>
                    </div>
                    <h1 className="topic-header-title">Детални резултати</h1>
                </div>

                {topicDetails && (
                    <>
                        {topicDetails.yesUsers?.length > 0 && (
                            <div>
                                <h2 className="d-flex justify-content-center m-3 detailed-table-header">Советници кои гласале за ({topicDetails.yesUsers.length}):</h2>
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th className="yes">Слика</th>
                                            <th className="yes">Име</th>
                                            <th className="yes">Презиме</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topicDetails.yesUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img src={`data:image/jpeg;base64,${user.image}`} alt={`${user.name} ${user.surname}`} className="details-image" />

                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.surname}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {topicDetails.abstainedUsers?.length > 0 && (
                            <div>
                                <h2 className="d-flex justify-content-center m-3 detailed-table-header">Советници кои гласале воздржани ({topicDetails.abstainedUsers.length}):</h2>
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th className="abstained">Слика</th>
                                            <th className="abstained">Име</th>
                                            <th className="abstained">Презиме</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topicDetails.abstainedUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img src={`data:image/jpeg;base64,${user.image}`} alt={`${user.name} ${user.surname}`} className="details-image" />

                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.surname}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {topicDetails.noUsers?.length > 0 && (
                            <div>
                                <h2 className="d-flex justify-content-center m-3 detailed-table-header">Советници кои гласале против ({topicDetails.noUsers.length}):</h2>
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th className="no">Слика</th>
                                            <th className="no">Име</th>
                                            <th className="no">Презиме</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topicDetails.noUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img src={`data:image/jpeg;base64,${user.image}`} alt={`${user.name} ${user.surname}`} className="details-image" />

                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.surname}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {topicDetails.cantVoteUsers?.length > 0 && (
                            <div>
                                <h2 className="d-flex justify-content-center m-3 detailed-table-header">Советници кои се иземуваат ({topicDetails.cantVoteUsers.length}):</h2>
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th className="cant-vote">Слика</th>
                                            <th className="cant-vote">Име</th>
                                            <th className="cant-vote">Презиме</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topicDetails.cantVoteUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img src={`data:image/jpeg;base64,${user.image}`} alt={`${user.name} ${user.surname}`} className="details-image" />

                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.surname}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {topicDetails.haventVoteUsers?.length > 0 && (
                            <div>
                                <h2 className="d-flex justify-content-center m-3 detailed-table-header">Советници кои не гласале ({topicDetails.haventVoteUsers.length}):</h2>
                                <table className="details-table">
                                    <thead>
                                        <tr>
                                            <th className="havent-vote">Слика</th>
                                            <th className="havent-vote">Име</th>
                                            <th className="havent-vote">Презиме</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topicDetails.haventVoteUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td>
                                                   <img src={`data:image/jpeg;base64,${user.image}`} alt={`${user.name} ${user.surname}`} className="details-image" />

                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.surname}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default TopicDetails;
