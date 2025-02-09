import React from 'react';
import { motion } from 'framer-motion';
import { FaSpotify } from 'react-icons/fa';

const Report = ({ groqResponse, users }) => {
	const sections = [
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

	if (!groqResponse || !users) {
		return <div>Loading...</div>; // Handle the case where data isn't available yet.
	}

	return (
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
						<div className='flex gap-6 text-center justify-center'>
							{/* User 1 Profile */}
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
											users[0]?.userData?.external_urls.spotify || 'user.png'
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
										<ul className='dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-4 space-y-6 shadow max-h-[60rem] overflow-y-auto'>
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

							{/* Score and Remarks */}
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

							{/* User 2 Profile */}
							<motion.div whileHover={{ scale: 1.05 }}>
								<div className='flex flex-col items-center justify-center gap-4 text-2xl font-bold rounded-3xl shadow-xl w-60 h-60'>
									<img
										src={users[1].userData?.images[0]?.url}
										className='w-24 h-24 rounded-full'
										alt='User 2 Profile Pic'
									/>
									<a
										className='flex items-center hover:text-secondary'
										href={
											users[1]?.userData?.external_urls.spotify || 'user.png'
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
										<ul className='dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-4 space-y-6 shadow max-h-[60rem] overflow-y-auto'>
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

					{/* Sections */}
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
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Report;
