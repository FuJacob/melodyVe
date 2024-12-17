import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'
const Features = () => {
	return (
		<>
			<div
				className='min-h-screen'
				style={{
					backgroundImage: "url('bg.svg')",
					backgroundSize: 'cover',
					backgroundPosition: '50% 100%',
				}}>
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
									<h1 className='font-bold text-3xl'>Genre Preference</h1>{' '}
								</div>
								<p>
									Analyzes the primary music genres each user gravitates towards
									(e.g., rock, hip-hop, indie, electronic) and identifies how
									closely their preferred genres align.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Mood Preference</h1>{' '}
								</div>
								<p>
									Examines what emotional states users tend to seek in their
									music - whether they prefer upbeat, melancholic, energetic, or
									calm music.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Melodies vs Vocal</h1>{' '}
								</div>
								<p>
									Looks at whether users prefer music with prominent vocals,
									purely instrumental tracks, or a mix of both, including their
									preferences.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Song Meanings</h1>{' '}
								</div>
								<p>
									Evaluates whether users connect more with lyrics focused on
									specific themes (love, social issues, storytelling) and if
									they prioritize lyrical depth.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Artist Overlap</h1>{' '}
								</div>
								<p>
									Looks at many artists both users listen to in common and the
									percentage of shared artists in their libraries or frequently
									played tracks.
								</p>
							</div>
						</motion.div>

						<motion.div whileHover={{ scale: 1.1 }}>
							<div className='bg-secondary rounded-3xl p-12 shadow-xl'>
								<div className='flex flex-inline justify-between mb-5'>
									<h1 className='font-bold text-3xl'>Time Periods</h1>{' '}
								</div>
								<p>
									Compares which musical eras each user prefers - whether they
									gravitate towards contemporary music, specific decades, or
									classical periods.
								</p>
							</div>
						</motion.div>
						<div className='bg-white p-6 mb-12 rounded-3xl shadow-xl text-xl font-semibold text-black col-span-3 grow w-[84rem] flex items-center justify-between'>
    <img src='melodyVe.svg' className='w-24'></img>
	<p>
        try melodyVe today and find out of you are a musically match for
        your significant other
    </p>
    <Link href='/input'>
        <button className='btn btn-md text-xl rounded-2xl btn-secondary text-white'>
            try meylodVe now
        </button>
    </Link>
</div>
</div>
					
				</div>
				
			</div>
		</>
	);
};

export default Features;
