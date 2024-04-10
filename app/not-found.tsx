import ModalProvider from '@/components/context/ModalProvider';
import ShowMessageModal from '@/components/layout/ShowMessageModal';
import Link from 'next/link';

export default function NotFound() {
	return (
		<main className="grid grid-cols-[min(95%,_480px)] grid-rows-1 justify-center items-center px-4">
			<div className="w-full p-4 flex items-center justify-center">
				<ModalProvider>
					<ShowMessageModal
						title="Not found"
						messages={['Page not found.', 'You will be redirected to the Homepage.']}
						redirectPath={'/'}
					/>
				</ModalProvider>
			</div>
		</main>
	);
}
