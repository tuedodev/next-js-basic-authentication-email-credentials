'use client';

import { searchAction } from '@/lib/session';
import ModalProvider from '../context/ModalProvider';
import UserDeleteItem from './UserDeleteItem';
import { useEffect, useOptimistic, useRef, useState } from 'react';
import Search from '../icons/Search';
import { useFormState } from 'react-dom';
import { UserWithReferences } from '@/lib/types';
import { deleteUser } from '@/lib/databaseQueries';
import { startTransition } from 'react';

type Props = {
	allUsers: UserWithReferences[];
};

const UserDeleteList: React.FC<Props> = ({ allUsers }) => {
	const [initAllUsers, setInitAllUsers] = useState<UserWithReferences[]>(allUsers);
	const [state, formAction] = useFormState(searchAction, null);
	const formEl = useRef<HTMLFormElement>(null);
	const [optimisticAllUsers, setOptimisticAllUsers] = useOptimistic<
		UserWithReferences[],
		number | UserWithReferences[]
	>(initAllUsers, (state, action) => {
		if (typeof action === 'number') {
			return [...state.filter((user) => user.id !== action)];
		}
		return [...action];
	});

	useEffect(() => {
		if (state) {
			startTransition(() => {
				setOptimisticAllUsers(state);
				setInitAllUsers(state);
			});
		}
	}, [state, setOptimisticAllUsers]);

	function onChangeHandler(event: React.FormEvent<HTMLInputElement>) {
		const form = event.currentTarget.form;
		if (form) {
			form.requestSubmit();
		}
	}

	async function deleteUserClient(id: number) {
		startTransition(() => {
			setOptimisticAllUsers(id);
		});
		await deleteUser(id);
		setInitAllUsers((prev) => [...prev.filter((user) => user.id !== id)]);
	}

	return (
		<>
			<nav className="grid grid-cols-[min(100%,_560px)] justify-center my-6">
				<form action={formAction} ref={formEl} className="relative flex w-full flex-wrap items-center">
					<input
						onChange={onChangeHandler}
						type="search"
						name="search"
						className="relative m-0 block w-[1px] min-w-0 flex-auto rounded border border-solid border-white/10 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-surface text-white transition duration-300 ease-in-out focus:border-primary focus:text-gray-200 focus:shadow-inset focus:outline-none motion-reduce:transition-none placeholder:text-neutral-300 autofill:shadow-autofill"
						placeholder="Search"
						aria-label="Search"
						aria-describedby="basic-search"
					/>
					<Search
						id="basic-search"
						className="flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-gray-600 dark:text-white [&>svg]:w-5"
					/>
				</form>
			</nav>
			{optimisticAllUsers.length > 0 ? (
				<ul className="space-y-4 text-left text-gray-400 w-full">
					<ModalProvider>
						{optimisticAllUsers.map((user) => {
							return (
								<UserDeleteItem
									key={user.id}
									status={user.status.name}
									role={user.role.name}
									fields={[user.email, user.firstname, user.lastname]}
									id={user.id}
									deleteUser={deleteUserClient.bind(null, user.id)}
								/>
							);
						})}
					</ModalProvider>
				</ul>
			) : (
				<p className="text-gray-300 text-xs flex items-center my-1 py-2 px-2 rounded-md bg-gray-700/75 mx-[84px]">
					No matching users found.
				</p>
			)}
		</>
	);
};

export default UserDeleteList;
