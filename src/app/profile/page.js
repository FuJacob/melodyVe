'use client';
import { useSession } from 'next-auth/react';
export default function ProfilePage() {
	const { data: session } = useSession();
	return session ? (
		<section
			className='h-screen p-36 pt-56 flex flex-row items-center justify-center gap-44 shadow-2xl'
			style={{
				backgroundImage: "url('bg.svg')",
				backgroundSize: 'cover',
			}}>
			<div className='h-full rounded-3xl w-96 shadow-xl bg-white border border-8 p-12 text-center'>
				<div className='flex flex-col'>
					<h1 className='text-2xl font-semibold'>welcome</h1>
					<img
						src={session?.user.image || 'user.png'}
						className='w-54 rounded-full m-8'
					/>
					<h1 className='text-5xl font-black'>{session.user.name}</h1>
					<h1 className='text-xl italic '>{session.user.email}</h1>
				</div>
			</div>
			<div className='flex flex-col justify-center items-center h-full w-[80rem] gap-6'>
				<div className='rounded-3xl shadow-xl bg-white border p-8 text-4xl font-black text-center'>
					Past Reports
				</div>
				<div className='p-12 h-full rounded-3xl w-full shadow-xl bg-white border'>
					LOREM
				</div>
			</div>
		</section>
	) : (
		<div className='h-screen flex flex-col gap-12 justify-center items-center text-5xl'>
			<h1>You are not logged in.</h1>
			<a href='/' className='btn'>Return to home</a>
		</div>
	);
}
