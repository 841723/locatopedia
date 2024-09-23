import { useRoutes } from "react-router-dom";
import { Layout } from "@/layouts/Layout";
import { Home } from "@/components/Home";
import { Page } from "@/components/Page";
import { NewArticle } from "@/components/NewArticle";
import { Account } from "@/components/Account";
import { NotFound404 } from "@/components/NotFound404";

function App() {
    const element = useRoutes([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/new",
            element: <NewArticle />,
        },
        {
            path: "/account",
            element: <Account />,
        },
        {
            path: "/wiki/:hash",
            element: <Page />,
        },
        {
            path: "*",
            element: <NotFound404 />,
        },
    ]);

    return <Layout>{element}</Layout>;
}

export default App;
