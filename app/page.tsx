import Image from 'next/image';

export default async function Home() {
	return (
		<article className="grid grid-cols-1 grid-rows-[auto_1fr] gap-4 px-4">
			<header className="grid grid-cols-1 md:grid-cols-2 grid-rows-[minmax(300px,_1fr)] gap-4 my-4">
				<div className="relative lg:aspect-[3/2]">
					<Image
						fill
						src="/carlos-muza-hpjSkU2UYSU-unsplash.jpg"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
						alt="Article Image"
						priority={true}
						style={{ objectFit: 'contain', top: '50%', transform: 'translateY(-50%)' }}
					/>
				</div>
				<h2 className="text-2xl flex justify-center items-center font-bold text-center">
					Unveiling the Latest Innovations in Next.js Framework
				</h2>
			</header>

			<section className="space-y-4">
				<h3 className="text-xl font-bold pl-4">Enhanced Image Component and Performance Optimization</h3>
				<p className="first-letter:text-4xl">
					Next.js, the popular React framework, continues to evolve with each new version, and the recent release of
					version 13 brings exciting updates and enhancements.
				</p>

				<h3 className="text-xl font-bold pl-4">Streamlined Development Experience and Improved Productivity</h3>
				<p>
					In addition to performance enhancements, Next.js 13 introduces faster startup times, enabling developers to
					streamline the build and deployment process. Furthermore, built-in support for Web Vitals empowers developers
					to effortlessly monitor and optimize core performance metrics, ensuring a seamless user experience.
				</p>
				<p>
					Whether you&apos;re a seasoned developer or just delving into web development, Next.js 13 equips you with the
					tools to craft modern, high-performance applications with ease. Explore these latest innovations and elevate
					your development workflow with Next.js!
				</p>
				<cite className="inline-block text-sm text-right my-3">Dummy Text created by ChatGPT</cite>
			</section>
		</article>
	);
}
