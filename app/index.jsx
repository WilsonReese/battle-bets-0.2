import { Redirect } from "expo-router";

const Index = () => {
	return <Redirect href="/pools/" />; // this will set the home page -- since I am working on the picks first, I set it to that
};
export default Index;