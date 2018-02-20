'use babel';

import React from 'react';

import { Layout } from 'antd';


import ConvertArea from './convert';

const { Footer, Content, Header } = Layout;


export default class App extends React.Component {
  render() {
    return (
        <Layout>

            <Header className="Header">
                <img className={'logoImage'}
                     src="assets/macuspian.png"
                     alt="Logo" />

                <h2>Conversión Mancuspiana</h2>
            </Header>

            <Content>
                <div className={'mainContent'}>

                    <ConvertArea />
                </div>

            </Content>

            <Footer>
                Developed by Michael Michailidis / Designs by Vecteezy
            </Footer>
        </Layout>
    );
  }
}
