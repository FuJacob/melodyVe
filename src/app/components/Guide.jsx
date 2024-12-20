import { motion } from 'framer-motion';
import React from 'react';

const Guide = () => {
	return (
		<>
			<div
				className='min-h-screen'
				style={{
					backgroundImage: 'url(bg2.svg)',
					backgroundSize: 'cover',
				}}>
				<div className='flex flex-col items-center gap-5'>
					<div className='flex flex-inline text-6xl font-black mt-40'>
						<h1>How does</h1> <img src='melodyve.svg' className='w-40 mx-6' />
						<h1>work?</h1>
					</div>
					<h2 className='text-xl w-1/2 text-center'>
						melodyVe is built to seamlessly turn musical data into compatibility
						scores.
					</h2>
					<div className='flex flex-col gap-5 m-16'>
						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='flex flex-row gap-12'>
								<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
									<h1 className='font-bold text-3xl mb-5'>
										Step 1 - Retrieving Data
									</h1>
									<p>
										Your musical gateway opens when you share your Spotify
										profile, allowing meylodVe to dive deep into your streaming
										patterns, saved tracks, and listening behaviors.
									</p>
								</div>
								<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
									<div className='flex justify-center'>
										<img
											className='w-40'
											src='data-collection.png'
											alt='picture'
										/>
									</div>
								</div>
							</div>
						</motion.div>
						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='flex flex-row gap-12'>
								<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
									<div className='flex justify-center'>
										<img className='w-40' src='machine.png' alt='picture' />
									</div>
								</div>
								<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
									<h1 className='font-bold text-3xl mb-5'>
										Step 2 - Analyzing Data
									</h1>
									<p>
										meylodVe's AI examines both profiles simultaneously,
										uncovering hidden connections through data points like
										streaming history, and listening patterns.
									</p>
								</div>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='flex flex-row gap-12'>
								<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
									<h1 className='font-bold text-3xl mb-5'>
										Step 3 - Present Findings
									</h1>
									<p>
										The final step transforms raw data into meaningful insights,
										calculating compatibility scores across six categories and
										presenting a clear picture of your musical chemistry.
									</p>
								</div>
								<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
									<div className='flex justify-center'>
										<img className='w-40' src='analysis.png' alt='picture' />
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Guide;
