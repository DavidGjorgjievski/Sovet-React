import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../styles/Topics.css';
import Header from '../components/Header';
import HeadLinks from '../components/HeadLinks';
import { initializeMobileMenu } from '../components/mobileMenu';
import TopicConfirmModal from '../components/TopicConfirmModal';
import HeaderPresenter from '../components/HeaderPresenter';

function Topics() {
    const [topics, setTopics] = useState([]);
    const { id } = useParams(); 
    const [userRole, setUserRole] = useState(null);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [selectedTopicTitle, setSelectedTopicTitle] = useState(null);


     const openModal = (topicId,topicTitle) => {
    setSelectedTopicId(topicId);
    setSelectedTopicTitle(topicTitle)
    setIsModalOpen(true); // Open the modal
    };

       const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTopicId(null); // Clear the topic ID when closing
        setSelectedTopicTitle(null); // Clear the title as well
    };

    const userInfo = useMemo(() => JSON.parse(localStorage.getItem('userInfo')), []);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();


const fetchTopics = useCallback(async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sessions/${id}/topics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopics(data);
    } catch (error) {
        console.error('Error fetching topics:', error);
    }
}, [id, token]);

useEffect(() => {
    if (userInfo && userInfo.role) {
        setUserRole(userInfo.role);
    }

    fetchTopics();
    const cleanupMobileMenu = initializeMobileMenu();
    return () => cleanupMobileMenu();
}, [token, userInfo, fetchTopics, id]);

const handleDelete = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/topics/${selectedTopicId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            closeModal();
            await fetchTopics(); // Re-fetch topics immediately after deletion
        } else {
            console.error('Failed to delete the topic');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

     useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
        const element = document.getElementById(hash.substring(1)); // Remove the '#' from the hash
        if (element) {
            // Timeout to allow the DOM to finish rendering
            const timeoutId = setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
                // Clear the hash from the URL after scrolling
                window.history.replaceState(null, null, ' ');
            }, 100); // Adjust the delay if necessary

            return () => clearTimeout(timeoutId); // Clean up timeout
        }
    }
}, [topics]);

    // Determine if the user can vote
    const canVote = userRole === 'ROLE_ADMIN' || userRole === 'ROLE_USER';

    const handlePdfFetch = async (pdfId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/topics/pdf/${pdfId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                },
            });

            if (response.ok) {
                // Create a blob from the response
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                // Open the PDF in a new tab
                window.open(url, '_blank');
            } else {
                console.error('PDF not found or could not be retrieved.');
            }
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };

    const startVoting = async (topicId, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/topics/active/${topicId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to start voting.');
        }
        console.log('Voting started successfully');
        // You can refresh data or trigger other effects here if needed
        await fetchTopics();
    } catch (error) {
        console.error('Error:', error);
    }
};

const finishVoting = async (topicId, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/topics/finish/${topicId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to finish voting.');
        }
        await fetchTopics();
        console.log('Voting finished successfully');
        // Trigger additional effects here if needed
    } catch (error) {
        console.error('Error:', error);
    }
};

const restartVoting = async (topicId, token) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/topics/create/${topicId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to restart voting.');
        }
        console.log('Voting restarted successfully');
        // Trigger additional effects here if needed
        await fetchTopics();
    } catch (error) {
        console.error('Error:', error);
    }
};

const handleVote = async (topicId, voteType) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/topics/${voteType}/${topicId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to vote: ${voteType}`);
        }
        console.log(`${voteType} vote submitted successfully`);
        await fetchTopics()
    } catch (error) {
        console.error('Error:', error);
    }
};
    

    return (
        <div className="topics-container">
            <HelmetProvider>
                <Helmet>
                    <title>Точки</title>
                </Helmet>
            </HelmetProvider>
            <HeadLinks />
           {userRole === 'ROLE_PRESENTER' ? (
                <HeaderPresenter />
            ) : (
                <Header userInfo={userInfo} />
            )}
            <main className="topcis-container-body">
                 {userRole !== 'ROLE_PRESENTER' && (
                <div className="topic-header">
                    <button
                        className="back-button back-button-topics"
                        onClick={() => navigate(`/sessions#session-${id}`)}
                    >
                        Назад
                    </button>
                    <h1 className="topic-header-title">Точки</h1>
                    <div className="session-button-container">
                        <Link to={`/sessions/${id}/topics/add-form`}>
                            {userRole === 'ROLE_ADMIN' && (
                                <button className="topic-add-button">Додади Точка</button>
                            )}
                        </Link>
                    </div>
                </div>
            )}

                <div className="topic-body">
                    {topics
                     .sort((a, b) => a.id - b.id) 
                        .map(topic => (
                        <div key={topic.id} className='topic-div-rel'>
                            <span id={`topic-${topic.id}`} className="topic-span-id"></span>
                            <div className={`topic-item ${ 
                                topic.topicStatus === 'FINISHED' ? 'finished-topic' : ''} ${
                                topic.topicStatus === 'ACTIVE' ? 'active-topic' : ''} ${
                                userRole === 'ROLE_PRESENTER' ? 'topic-item-size-presenter' : 'topic-item-size'
                            }`}>
                                <h3 className='text-center'>
                                    {topic.pdfFileId ? (
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePdfFetch(topic.pdfFileId);
                                        }}
                                        className='topic-header-pdf'
                                    >
                                        {topic.title}
                                    </span>
                                    ) : (
                                        <span>{topic.title}</span>
                                    )}
                                </h3>
                                <div className='topic-item-body'>
                                    <div className="topic-item-body-detail">
                                        <div className="topic-item-body-detail-group">
                                            <div className={`topic-item-body-detail-group-chunk ${userInfo.role === 'ROLE_PRESENTER' ? 'topic-item-body-detail-group-chunk-margin-presenter' : 'topic-item-body-detail-group-chunk-margin'}`}>
                                                <div>
                                                    <div className="rez-container" style={{ display: userInfo.role !== 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                        <span className="text-for-rez">За:</span>
                                                    </div>
                                                    <div className="rez-container" style={{ display: userInfo.role === 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                        <span className="text-for-rez-big">За:</span>
                                                    </div>
                                                </div>
                                                <div>
                                                   <div className="rez-container">
                                                        <span className={userInfo.role === 'ROLE_PRESENTER' ? 'vote-numbers-yes-big' : 'vote-numbers-yes'}>
                                                            {topic.yes}
                                                        </span>
                                                    </div>
                                                </div>
                                                {canVote && topic.topicStatus === 'ACTIVE' && (
                                                     <div className="rez-container">
                                                    <button
                                                        onClick={() => handleVote(topic.id, 'yes')}
                                                        className="btn btn-sm btn-success yes topic-button"
                                                    >
                                                        За
                                                    </button>
                                                </div>
                                                )}
                                            </div>
                                            <div className={`topic-item-body-detail-group-chunk ${userInfo.role === 'ROLE_PRESENTER' ? 'topic-item-body-detail-group-chunk-margin-presenter' : 'topic-item-body-detail-group-chunk-margin'}`}>
                                                <div>
                                                    <div className="rez-container" style={{ display: userInfo.role !== 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                        <span className="text-for-rez">Против:</span>
                                                    </div>
                                                    <div className="rez-container" style={{ display: userInfo.role === 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                        <span className="text-for-rez-big">Против:</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="rez-container">
                                                        <span className={userInfo.role === 'ROLE_PRESENTER' ? 'vote-numbers-no-big' : 'vote-numbers-no'}>
                                                            {topic.no}
                                                        </span>
                                                    </div>
                                                </div>
                                                {canVote && (userInfo.role === 'ROLE_ADMIN' || userInfo.role === 'ROLE_USER') && topic.topicStatus === 'ACTIVE' && (
                                                    <div className="rez-container">
                                                    <button
                                                        onClick={() => handleVote(topic.id, 'no')}
                                                        className="btn btn-sm btn-danger topic-button"
                                                    >
                                                        Против
                                                    </button>
                                                </div>
                                                )}
                                            </div>
                                           
                                        </div>
                                        <div className="topic-item-body-detail-group">
                         

                                            <div className={`topic-item-body-detail-group-chunk ${
                                                    userInfo.role === 'ROLE_PRESENTER' ? 'topic-item-body-detail-group-chunk-margin-presenter' : 'topic-item-body-detail-group-chunk-margin'}`}>
                                                    <div>
                                                        <div>
                                                            <div className="rez-container" style={{ display: userInfo.role !== 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                                <span className="text-for-rez">Воздржан:</span>
                                                            </div>
                                                            <div className="rez-container" style={{ display: userInfo.role === 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                                <span className="text-for-rez-big">Воздржан:</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                           <div className="rez-container">
                                                                <span className={userInfo.role === 'ROLE_PRESENTER' ? 'vote-numbers-abstained-big' : 'vote-numbers-abstained'}>
                                                                    {topic.abstained}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {canVote && (userInfo.role === 'ROLE_ADMIN' || userInfo.role === 'ROLE_USER') && topic.topicStatus === 'ACTIVE' && (
                                                             <div className="rez-container">
                                                            <button
                                                                onClick={() => handleVote(topic.id, 'abstained')}
                                                                className="btn btn-sm btn-warning topic-button"
                                                            >
                                                                Воздржан
                                                            </button>
                                                        </div>
                                                        )}
                                                    </div>
                                                </div>

                                            <div className={`topic-item-body-detail-group-chunk ${userInfo.role === 'ROLE_PRESENTER' ? 'topic-item-body-detail-group-chunk-margin-presenter' : 'topic-item-body-detail-group-chunk-margin'}`}>
                                                <div>
                                                    <div className="rez-container" style={{ display: userInfo.role !== 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                        <span className="text-for-rez">Се иземува:</span>
                                                    </div>
                                                    <div className="rez-container" style={{ display: userInfo.role === 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                        <span className="text-for-rez-big">Се иземува:</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="rez-container">
                                                        <span className={userInfo.role === 'ROLE_PRESENTER' ? 'vote-numbers-cant-vote-big' : 'vote-numbers-cant-vote'}>
                                                            {topic.cantVote}
                                                        </span>
                                                    </div>
                                                </div>
                                                {canVote && (userInfo.role === 'ROLE_ADMIN' || userInfo.role === 'ROLE_USER') && topic.topicStatus === 'ACTIVE' && (
                                                    <div className="rez-container">
                                                    <button
                                                        onClick={() => handleVote(topic.id, 'cant-vote')}
                                                        className="btn btn-sm btn-secondary topic-button"
                                                    >
                                                        Се иземува
                                                    </button>
                                                </div>
                                                )}
                                            </div>
                                    </div>
                                        <div>
                                            <div>
                                                <div className="rez-container" style={{ display: userInfo.role !== 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                    <span className="text-for-rez">Не гласале:</span>
                                                </div>
                                                <div className="rez-container" style={{ display: userInfo.role === 'ROLE_PRESENTER' ? 'block' : 'none' }}>
                                                    <span className="text-for-rez-big">Не гласале:</span>
                                                </div>
                                            </div>

                                            <div>
                                               <div className="rez-container">
                                                    <span className={userInfo.role === 'ROLE_PRESENTER' ? 'vote-numbers-havent-vote-big' : 'vote-numbers-havent-vote'}>
                                                        {topic.haveNotVoted}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                        <div className="topic-item-body-detail">
                                            <div className="topic-item-body-detail-group">
                                                {/* Detailed Results Button, visible to non-ROLE_PRESENTER users */}
                                                {userInfo.role !== 'ROLE_PRESENTER' && (
                                                    <div className="command-buttons">
                                                        <a
                                                            href={`/sessions/${id}/topics/details/${topic.id}`}
                                                            className="btn btn-sm btn-primary topic-button"
                                                        >
                                                            <i className="fa fa-eye"></i> Детални резултати
                                                        </a>
                                                    </div>
                                                )}

                                            {userInfo.role === 'ROLE_ADMIN' && (
                                               <div className="command-buttons-group">
                                                {topic.topicStatus === 'CREATED' && (
                                                    <div className="command-buttons">
                                                        <button
                                                            onClick={() => startVoting(topic.id, token)}
                                                            className="btn btn-sm btn-success topic-button"
                                                        >
                                                            Започни гласање
                                                        </button>
                                                    </div>
                                                )}
                                                {topic.topicStatus === 'ACTIVE' && (
                                                    <div className="command-buttons">
                                                        <button
                                                            onClick={() => finishVoting(topic.id, token)}
                                                            className="btn btn-sm btn-info topic-button"
                                                        >
                                                            Заврши гласање
                                                        </button>
                                                    </div>
                                                )}
                                                {topic.topicStatus === 'FINISHED' && (
                                                    <div className="command-buttons">
                                                        <button
                                                            onClick={() => restartVoting(topic.id, token)}
                                                            className="btn btn-sm btn-success topic-button"
                                                        >
                                                            Повторно гласање
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            )}
                                        </div>

                                        {/* Edit and Delete controls, visible to ROLE_ADMIN users */}
                                        {userInfo.role === 'ROLE_ADMIN' && (
                                            <div className="topic-item-body-detail-group">
                                                <div className="command-buttons">
                                                    <a
                                                        href={`/sessions/${id}/topics/edit/${topic.id}`}
                                                        className="btn btn-sm btn-warning topic-button"
                                                    >
                                                        Уреди
                                                    </a>
                                                </div>
                                                <div className="command-buttons">
                                                   
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger topic-button"
                                                            onClick={() => openModal(topic.id,topic.title)} // Pass topic.id to openModal
                                                        >
                                                            Избриши
                                                        </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        {topics.length > 2 && userRole === 'ROLE_ADMIN' && (
                            <Link to={`/sessions/${id}/topics/add-form`}>
                                <button className="topic-add-button">Додади Точка</button>
                            </Link>
                        )}
                    </div>
                </div>
            </main>


          {isModalOpen && (
                <TopicConfirmModal
                    isOpen={isModalOpen}  
                    onClose={closeModal}  
                    onConfirm={handleDelete}
                    topicTitle={selectedTopicTitle ? `${selectedTopicTitle}` : ''}
                />
            )}
        </div>

        
    );
}

export default Topics;
