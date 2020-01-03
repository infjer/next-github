import { Layout, Button, } from 'antd'
import Link from 'next/link'

const { Header, Content, Footer, } = Layout

export default ({ children, }) => (
     <Layout>
         <Header>
             <Link href='/'>
                 <Button>index</Button>
             </Link>
             <Link href='/user?id=1' as='/user/1'>
                 <Button>user1</Button>
             </Link>
             <Link href='/user?id=2' as='/user/2'>
                 <Button>user2</Button>
             </Link>
             <Link href='/statehook'>
                 <Button>statehook</Button>
             </Link>
             <Link href='/contexthook'>
                 <Button>contexthook</Button>
             </Link>
             <Link href='/refhook'>
                 <Button>refhook</Button>
             </Link>
             <Link href='/optimize'>
                 <Button>optimize</Button>
             </Link>
             <Link href='/redux'>
                 <Button>redux</Button>
             </Link>
         </Header>
         <Content>
             { children }
         </Content>
         <Footer>
             <span>foot</span>
         </Footer>
     </Layout>
 )
