'use client';
import { BarLoader } from 'react-spinners';
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Report from './Report';
import { useSession } from 'next-auth/react';

const Submit = () => {
	const { data: session } = useSession(); // Access the session (user info)
	const [inputValues, setInputValues] = useState(['', '']);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showInputError, setshowInputError] = useState(false);
	const [playlistTracks, setPlaylistTracks] = useState({});
	const [groqResponse, setGroqResponse] = useState(null);
	const [playlists, setPlaylists] = useState({});
	const goToReport = useRef(null);
	const API_URL = process.env.NEXT_PUBLIC_API_URL;
	useEffect(() => {
		if (groqResponse && goToReport.current) {
			goToReport.current.scrollIntoView({ behaviour: 'smooth' });
		}
	}, [groqResponse]);

	const handleInputChange = (index, value) => {
		const updatedInputs = [...inputValues];
		updatedInputs[index] = value.replace('https://open.spotify.com/user/', '');
		setInputValues(updatedInputs);
	};

	const fetchUserData = async (username) => {
		try {
			const response = await fetch(
				`${API_URL}/getUserData?username=${username}`
			);
			const playlistsResponse = await fetch(
				`${API_URL}/getUserPlaylists?username=${username}`
			);

			if (!response.ok || !playlistsResponse.ok) {
				throw new Error('Failed to fetch data');
			}

			const userData = await response.json();
			const playlistsData = await playlistsResponse.json();

			return { userData, playlistsData };
		} catch (error) {
			return { error: error.message };
		}
	};

	const fetchPlaylistTracks = async (playlistId) => {
		try {
			const response = await fetch(
				`${API_URL}/getPlaylistItems?playlist_id=${playlistId}`
			);
			if (!response.ok) throw new Error('Failed to fetch playlist tracks');

			const playlistData = await response.json();
			return playlistData.items
				.filter((item) => item.track)
				.map((item) => item.track.name);
		} catch (error) {
			console.error('Error fetching playlist tracks:', error.message);
			return [];
		}
	};

	const sendToGroqAI = async (userTracks, fetchedUsers) => {
		try {
			const tracks = [userTracks[1] || [], userTracks[2] || []];
			const response = await fetch(`${API_URL}/sendToGroq`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userTracks: tracks }),
			});

			if (!response.ok) {
				throw new Error('Failed to send tracks to Groq');
			}

			const result = await response.json();
			setGroqResponse(result);

			// Add save-report functionality here

			const reportData = {
				users: fetchedUsers,
				userID: session.user.email, // Add userId from session at the top
				...result, // Spread the existing result data
			};

			if (!session) {
				throw new Error('User not authenticated');
			}
			const saveResponse = await fetch(`${API_URL}/save-report`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reportData),
			});

			if (!saveResponse.ok) {
				throw new Error('Failed to save report');
			}

			const saveData = await saveResponse.json();
			console.log('Report saved:', saveData);
		} catch (error) {
			console.error('Error:', error.message);
		}
	};

	const handleButtonClick = async () => {
		if (inputValues.filter((value) => value).length < 2) {
			setshowInputError(true);
			return;
		}

		setLoading(true);

		try {
			const fetchedUsers = await Promise.all(
				inputValues.map(async (username) => fetchUserData(username))
			);

			setUsers(fetchedUsers);
			console.log('Fetched Users:', fetchedUsers); // Log the fetched users

			const userTracks = {};

			await Promise.all(
				fetchedUsers.map(async (user, userIndex) => {
					const key = userIndex + 1;
					userTracks[key] = [];

					if (user.playlistsData?.items) {
						userTracks[key].push(user.userData.display_name); // Add username as first element
						for (const playlist of user.playlistsData.items) {
							const trackNames = await fetchPlaylistTracks(playlist.id);
							userTracks[key].push(...trackNames);
						}
					}
				})
			);
			if (userTracks[1] && userTracks[2]) {
				await sendToGroqAI(userTracks, fetchedUsers);
			} else {
				console.error('Error: Missing tracks for one or both users');
			}
		} catch (error) {
			console.error('Error fetching users:', error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div
				className=' min-h-screen'
				style={{
					backgroundImage: "url('bg1.svg')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}>
				<div className='flex flex-col items-center space-y-12'>
					<div className='flex flex-col justify-center place-items-center min-h-screen gap-10 w-full'>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								delay: 0.5,
								duration: 2,
							}}>
							<img src='melodyve.svg' className='w-[34rem] mt-24' />
						</motion.div>{' '}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								delay: 1,
								duration: 2,
							}}>
							{' '}
							<motion.div whileHover={{ scale: 1.05 }}>
								<div className='w-96'>
									<div className='space-y-6 bg-white p-6 rounded-3xl border shadow-xl bg-gray-50 text-center'>
										<h1 className='font-semibold'>
											begin by entering both user profiles
										</h1>{' '}
										{inputValues.map((value, index) => (
											<input
												key={index}
												type='text'
												placeholder={`user ${index + 1} link/id`}
												value={value}
												onChange={(e) =>
													handleInputChange(index, e.target.value)
												}
												className={`input w-full text-center ${
													showInputError ? 'border-2 border-rose-500' : ''
												}`}
												onBlur={() => setshowInputError(false)}
											/>
										))}
										{showInputError ? (
											<p className='text-secondary text-sm'>
												Please enter in 2 user profiles
											</p>
										) : (
											''
										)}
										<button
											className='btn btn-secondary w-full text-white'
											onClick={handleButtonClick}>
											{loading ? (
												<div className='flex justify-center'>
													<BarLoader
														size={100}
														color='#ffffff'
														loading={loading}
													/>
												</div>
											) : (
												<p>get started</p>
											)}
										</button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</div>
			{groqResponse && users.length > 0 && (
				<Report groqResponse={groqResponse} users={users} ref={goToReport} />
			)}
		</>
	);
};

export default Submit;
