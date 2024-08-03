import { useRouter } from "next/navigation";

const UserHomePage = ({ params }) => {
  const { user_id } = params;

  return (
    <div>
      <h1>Welcome, User {user_id}</h1>
      <p>This is your home page.</p>
    </div>
  );
};

export default UserHomePage;
