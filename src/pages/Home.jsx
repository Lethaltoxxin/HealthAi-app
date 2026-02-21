import HomeHeader from '../components/HomeHeader';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <HomeHeader />
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <ChatInterface />
            </div>
        </div>
    );
}
