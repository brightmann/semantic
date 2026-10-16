import { ROUTES } from "@semantic/constants/menu";
import { redirect } from "next/navigation";

const HomePage = () => {
  redirect(ROUTES.POSTS);
};

export default HomePage;
