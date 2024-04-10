const AuthorizationPage = () => {
	/* This page.tsx site inside folder ./authorization contains dummy text and can be deleted without any consequences. */

	return (
		<article className="grid grid-cols-1 grid-rows-[auto_1fr] gap-4 px-4">
			<h2 className="text-2xl flex justify-start items-center font-bold text-center underline">
				Demystifying Authorization in JavaScript Applications
			</h2>

			<section className="space-y-4">
				<p className="first-letter:text-4xl">
					Authorization plays a crucial role in ensuring that users have the appropriate access rights within an
					application. In JavaScript applications, including frameworks like Next.js, implementing authorization
					involves controlling user permissions and restricting access to certain resources or functionalities.
				</p>
				<h3 className="text-xl font-bold pl-4">Role-Based Access Control (RBAC)</h3>
				<p>
					One common approach to authorization in JavaScript applications is Role-Based Access Control (RBAC). With
					RBAC, permissions are assigned based on roles, and users are granted access to resources or functionalities
					according to their assigned roles. JavaScript frameworks often provide tools and libraries to streamline the
					implementation of RBAC, making it easier for developers to manage and enforce access control policies within
					their applications.
				</p>
				<h3 className="text-xl font-bold pl-4">Access Control Lists (ACL)</h3>
				<p>
					Another authorization strategy used in JavaScript applications is Access Control Lists (ACL). ACL allows
					developers to define specific access rules for individual users or groups, providing fine-grained control over
					who can access certain resources or perform specific actions. Implementing ACL in JavaScript applications may
					require custom logic or the use of specialized libraries to manage access permissions effectively.
				</p>
				<p>
					By understanding and implementing authorization strategies such as RBAC and ACL, JavaScript developers can
					ensure that their applications remain secure and compliant with access control requirements. These approaches
					empower developers to enforce access policies effectively and protect sensitive data from unauthorized access.
				</p>
				<cite className="inline-block text-sm text-right my-3">Dummy Text created by ChatGPT</cite>
			</section>
		</article>
	);
};

export default AuthorizationPage;
