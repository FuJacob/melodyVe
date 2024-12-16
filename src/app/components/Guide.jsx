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
					<div className='flex flex-inline text-6xl font-black mt-36'>
						<h1>How does</h1> <img src='melodyve.svg' className='w-40 mx-6' />
						<h1>work?</h1>
					</div>
					<h2 className='text-xl w-1/2 text-center'>
						Our AI content detector is built to help you get a clear and
						accurate assessment.
					</h2>
					<div className='flex flex-col gap-5 m-16'>
						<div className='flex flex-row gap-12'>
							<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
								<h1 className='font-bold text-3xl mb-3'>Step 1</h1>
								<p className='text-xl'>
									My feet are sweating profusely. An hour after putting on shoes
									my socks are full of moisture and my feet feel like they're
									freezing to death.
								</p>
							</div>
							<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
								<div className='flex justify-center'>
									<img className='w-36' src='spotify.png' alt='picture' />
								</div>
							</div>
						</div>
	
						<div className='flex flex-row gap-12'>
							<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
								<div className='flex justify-center'>
									<img className='w-36' src='spotify.png' alt='picture' />
								</div>
							</div>
							<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
								<h1 className='font-bold text-3xl mb-3'>Step 2</h1>
								<p className='text-xl'>
									My feet are sweating profusely. An hour after putting on shoes
									my socks are full of moisture and my feet feel like they're
									freezing to death.
								</p>
							</div>
						</div>
	
						<div className='flex flex-row gap-12'>
							<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
								<h1 className='font-bold text-3xl mb-3'>Step 3</h1>
								<p className='text-xl'>
									My feet are sweating profusely. An hour after putting on shoes
									my socks are full of moisture and my feet feel like they're
									freezing to death.
								</p>
							</div>
							<div className='bg-base-100 shadow-xl rounded-3xl w-[30rem] h-[16rem] border p-12'>
								<div className='flex justify-center'>
									<img className='w-36' src='spotify.png' alt='picture' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Guide;
