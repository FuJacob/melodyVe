'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import ReportPop from '../components/ReportPop';
import Link from 'next/link';

export default function ProfilePage() {
	const { data: session } = useSession();
	const [reports, setReports] = useState([]);
	const [selectedReport, setSelectedReport] = useState(null);
	// Fetch reports
	const getReports = async () => {
		if (!session) {
			console.error('User not logged in');
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:4000/get-reports?userID=${session.user.email}`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setReports(data);
		} catch (error) {
			console.error('Error fetching reports:', error);
		}
	};

	useEffect(() => {
		getReports();
	}, [session]); // Re-fetch reports when session changes

	return session ? (
		<section
			className='h-screen p-36 pt-56 flex flex-row items-center justify-center gap-44 shadow-2xl'
			style={{
				backgroundImage: "url('bg.svg')",
				backgroundSize: 'cover',
			}}>
			{/* User Info */}
			<div className='h-full rounded-3xl w-96 shadow-xl bg-white border border-8 p-12 text-center'>
				<div className='flex flex-col'>
					<h1 className='text-2xl font-semibold'>Welcome</h1>
					<img
						src={session?.user.image || 'user.png'}
						className='w-54 rounded-full m-8'
					/>
					<h1 className='text-5xl font-black'>{session.user.name}</h1>
					<h1 className='text-xl italic'>{session.user.email}</h1>
				</div>
			</div>

			{/* Reports Section */}
			<div className='flex flex-col justify-center items-center h-full w-[80rem] gap-6'>
				<div className='rounded-3xl shadow-xl bg-white border p-8 text-4xl font-black text-center'>
					Past Reports
				</div>
				<div className='p-12 h-full rounded-3xl w-full shadow-xl bg-white border'>
					<div className='grid grid-cols-4 gap-6 h-full w-full overflow-scroll'>
						{reports.map((report, index) => (
							<>
								<div key={index}>
									{/* Open Modal Button */}
									<button
										className='btn bg-white rounded-3xl w-48 h-48 border shadow-xl'
										onClick={() => setSelectedReport(report)}>
										<img src='melodyve.svg' className='w-24' />
										<h1>{report.createdAt}</h1>
									</button>

									{/* Modal */}
								</div>
							</>
						))}

						{selectedReport && (
							<>
							
								<div className='fixed top-1/4 w-1/2 h-1/2 left-1/4 z-50 '>
								<button
								className='btn mb-4 w-full btn-secondary text-white text-xl shadow-2xl'
								onClick={() => setSelectedReport(null)}>
								Close
							</button>
									<div className='overflow-y-auto h-full rounded-2xl shadow-2xl py-8 bg-white'>
										<ReportPop
											groqResponse={selectedReport}
											users={selectedReport.users}
										/>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	) : (
		<div className='h-screen flex flex-col gap-12 justify-center items-center text-5xl'>
			<h1>You are not logged in.</h1>
			<Link href='/' className='btn'>
				Return to home
			</Link>
		</div>
	);
}
