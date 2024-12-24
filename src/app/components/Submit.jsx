'use client';
import { BarLoader } from 'react-spinners';
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpotify } from 'react-icons/fa';

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
				`http://localhost:4000/getUserData?username=${username}`
			);
			const playlistsResponse = await fetch(
				`http://localhost:4000/getUserPlaylists?username=${username}`
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
				`http://localhost:4000/getPlaylistItems?playlist_id=${playlistId}`
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

	const sendToGroqAI = async (userTracks) => {
		try {
			const tracks = [userTracks[1] || [], userTracks[2] || []];
			const response = await fetch('http://localhost:4000/sendToGroq', {
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
				userID: session.user.email, // Add userId from session at the top
				...result, // Spread the existing result data
			};

			if (!session) {
				throw new Error('User not authenticated');
			}
			const saveResponse = await fetch('http://localhost:4000/save-report', {
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
				await sendToGroqAI(userTracks);
			} else {
				console.error('Error: Missing tracks for one or both users');
			}
		} catch (error) {
			console.error('Error fetching users:', error.message);
		} finally {
			setLoading(false);
		}
	};

	const sections = groqResponse && [
		{ title: 'Genre Preference', data: groqResponse.genrePreferences },
		{ title: 'Mood Preference', data: groqResponse.mood },
		{
			title: 'Instrumental vs Vocal',
			data: groqResponse.instrumentalVocalPreference,
		},
		{ title: 'Song Meanings', data: groqResponse.songMeanings },
		{ title: 'Artist Overlap', data: groqResponse.artistOverlap },
		{ title: 'Time Periods', data: groqResponse.timePeriods },
	];

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

			{groqResponse && users && (
				<div
					className='flex justify-center items-center min-h-screen'
					style={{
						backgroundImage: "url('bg3.svg')",
						backgroundSize: 'cover',
					}}>
					<div className='flex-col w-3/4'>
						<div className='p-5'>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									delay: 0.5,
									duration: 2,
								}}>
								<div
									ref={goToReport}
									className='flex gap-6 text-center justify-center'>
									<motion.div whileHover={{ scale: 1.05 }}>
										<div className='flex flex-col items-center justify-center gap-4 text-2xl font-bold rounded-3xl shadow-xl w-60 h-60'>
											<img
												src={users[0].userData?.images[0]?.url || 'user.png'}
												className='w-24 h-24 rounded-full'
												alt='User 1 Profile Pic'
											/>

											<a
												className='flex items-center hover:text-secondary'
												href={
													users[0]?.userData?.external_urls.spotify ||
													'user.png'
												}
												target='_blank'>
												{users[0]?.userData?.display_name}
												<FaSpotify size={20} className='ml-2' />
											</a>

											<div className='dropdown dropdown-bottom'>
												<div
													tabIndex={0}
													role='button'
													className='btn btn-secondary text-white btn-sm'>
													View playlists
												</div>
												<ul
													tabIndex={0}
													className='dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-4 space-y-6 shadow max-h-[60rem] overflow-y-auto'>
													<div className='grid grid-cols-2 gap-2'>
														{users[0]?.playlistsData?.items.map(
															(playlistItem, index) => (
																<a
																	href={playlistItem?.external_urls.spotify}
																	target='_blank'
																	key={index}>
																	<img
																		src={playlistItem.images[0].url}
																		className='rounded-3xl transition duration-300 hover:brightness-60'
																	/>
																	<h1 className='mt-3'>
																		{' '}
																		{playlistItem.name || 'Spotify Playlist'}
																	</h1>
																</a>
															)
														)}
														<h1 className='col-span-2 font-normal italic text-center'>
															End of playlists
														</h1>
													</div>
												</ul>
											</div>
										</div>
									</motion.div>

									<div className='flex flex-col border space-y-6 shadow-xl p-5 w-1/2 rounded-2xl text-center'>
										<div className='flex flex-inline justify-center space-x-2'>
											<img src='melodyve.svg' className='w-24' />
											<h3 className='text-2xl font-semibold'>score</h3>
										</div>
										<p className='text-5xl font-black'>
											{groqResponse.totalMelodyveScore.score}/100
										</p>
										<p>{groqResponse.totalMelodyveScore.finalRemarks}</p>
									</div>

									<motion.div whileHover={{ scale: 1.05 }}>
										<div className='flex flex-col items-center justify-center gap-4 text-2xl font-bold rounded-3xl shadow-xl w-60 h-60'>
											<img
												src={users[1].userData?.images[0]?.url}
												className='w-24 h-24 rounded-full'
												alt='User 1 Profile Pic'
											/>
											<a
												className='flex items-center hover:text-secondary'
												href={
													users[1]?.userData?.external_urls.spotify ||
													'user.png'
												}
												target='_blank'>
												{users[1]?.userData?.display_name}
												<FaSpotify size={20} className='ml-2' />
											</a>
											<div className='dropdown dropdown-bottom'>
												<div
													tabIndex={0}
													role='button'
													className='btn btn-secondary text-white btn-sm'>
													View playlists
												</div>
												<ul
													tabIndex={0}
													className='dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-4 space-y-6 shadow max-h-[60rem] overflow-y-auto'>
													<div className='grid grid-cols-2 gap-2'>
														{users[1]?.playlistsData?.items.map(
															(playlistItem, index) => (
																<a
																	href={playlistItem?.external_urls.spotify}
																	target='_blank'
																	key={index}>
																	<img
																		src={playlistItem.images[0].url}
																		className='rounded-3xl transition duration-300 hover:brightness-60'
																	/>
																	<h1 className='mt-3'>
																		{' '}
																		{playlistItem.name || 'Spotify Playlist'}
																	</h1>
																</a>
															)
														)}
														<h1 className='col-span-2 font-normal italic text-center'>
															End of playlists
														</h1>
													</div>
												</ul>
											</div>
										</div>
									</motion.div>
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									delay: 1,
									duration: 2,
								}}>
								<div className='grid grid-cols-2 gap-6 m-6'>
									{sections.map(
										(section, index) =>
											section.data && (
												<motion.div whileHover={{ scale: 1.05 }} key={index}>
													<div className='bg-base-100 rounded-2xl shadow-lg p-8 border'>
														<div className='flex gap-x-5 font-semibold'>
															<div className='bg-secondary text-white rounded-xl w-12 flex items-center justify-center'>
																{section.data.score}/10
															</div>
															<h3 className='text-2xl'>{section.title}</h3>
														</div>
														<ul className='list-disc space-y-2 mt-5 m-3'>
															{section.data.explanation?.map(
																(item, explanationIndex) => (
																	<li key={explanationIndex}>{item}</li>
																)
															)}
														</ul>
													</div>
												</motion.div>
											)
									)}
									{/* Total MelodyVe Score */}
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Submit;
