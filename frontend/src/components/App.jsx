import { Page } from "@/components/Page";
import { Layout } from "@/layouts/Layout";
import { useRoutes } from "react-router-dom";
import { Home } from "@/components/Home";
import { Account } from "@/components/Account";
import { NewArticle } from "@/components/NewArticle";
import { VersionDisplay } from "@/components/VersionDisplay";

function App() {
    const element = useRoutes([
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/account",
            element: <Account />,
        },
        {
            path: "/wiki/new",
            element: <NewArticle />,
        },
        {
            path: "/wiki/new/:hash",
            element: <NewArticle />,
        },
        {
            path: "/wiki/new/:hash/:version",
            element: <NewArticle />,
        },
        {
            path: "/wiki/:hash/:version",
            element: <Page />,
        },
        {
            path: "/wiki/:hash",
            element: <Page />,
        },
        {
            path: "/wiki/:hash/versions",
            element: <VersionDisplay />,
        },
        {
            path: "*",
            element: (
                <div className='text-8xl my-10 font-medium'>
                    <span className='text-[15rem] font-bold tracking-wider'>
                        404
                    </span>{" "}
                    <br />
                    Page not found
                </div>
            ),
        },
    ]);

    return <Layout>{element}</Layout>;
}

export default App;
