import React from 'react';
import { motion } from 'framer-motion';
const Features = () => {
	return (
		<>
			<div
				className='min-h-screen'
				style={{ backgroundImage: "url('bg.svg')", backgroundSize: 'cover', backgroundPosition: '50% 100%' }}>
				<div className=''>
				<div className='p-24 text-center'>
						<div className='text-center text-5xl font-black mb-6'>
							Categories meylodVe looks at
						</div>
						<h2 className='text-xl'>
							Our AI content detector is built to help you get a clear and
							accurate assessment.
						</h2>
				</div>
					

					<div className='grid grid-cols-3 text-white place-items-center gap-12 px-36'>
						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood</h1>{' '}
									<h2 className='text-3xl font-bold'>/10</h2>
								</div>
								<p>
									Institutions and publishers primarily choose Winston AI for
									its accuracy rates in detecting AI generated content and low
									false positives.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood</h1>{' '}
									<h2 className='text-3xl font-bold'>/10</h2>
								</div>
								<p>
									Institutions and publishers primarily choose Winston AI for
									its accuracy rates in detecting AI generated content and low
									false positives.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood</h1>{' '}
									<h2 className='text-3xl font-bold'>/10</h2>
								</div>
								<p>
									Institutions and publishers primarily choose Winston AI for
									its accuracy rates in detecting AI generated content and low
									false positives.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood</h1>{' '}
									<h2 className='text-3xl font-bold'>/10</h2>
								</div>
								<p>
									Institutions and publishers primarily choose Winston AI for
									its accuracy rates in detecting AI generated content and low
									false positives.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood</h1>{' '}
									<h2 className='text-3xl font-bold'>/10</h2>
								</div>
								<p>
									Institutions and publishers primarily choose Winston AI for
									its accuracy rates in detecting AI generated content and low
									false positives.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood</h1>{' '}
									<h2 className='text-3xl font-bold'>/10</h2>
								</div>
								<p>
									Institutions and publishers primarily choose Winston AI for
									its accuracy rates in detecting AI generated content and low
									false positives.
								</p>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Features;
