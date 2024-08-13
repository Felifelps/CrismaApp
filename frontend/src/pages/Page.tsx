import { Navigate } from "react-router-dom";

import '../assets/styles/Pages.css'
import '../assets/styles/Table.css'

import Main from "../components/Main";
import Header from "../components/Header";

import { useToken } from "../contexts/Token";

export default function Page(props: any) {
    return (
        <>
            <Header/>
            <Main>
                {props.children}
            </Main>
        </>
    )
}

export function AdminOnlyPage(props: any) {
    const token = useToken().token;
    return (
        <Page>
            {token ? <></> : <Navigate to='/login' replace/>}
            {props.children}
        </Page>
    );
}
