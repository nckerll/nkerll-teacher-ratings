import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from 'flarum/common/components/Page';
import App from '../components/App';
import { User } from '../../common/types';

declare const app: any;

const adaptFlarumUser = (flarumUser: any): User | null => {
  if (!flarumUser) return null;
  return {
    id: flarumUser.id(),
    username: flarumUser.username(),
    role: flarumUser.isAdmin() ? 'Yönetici' : 'Standart Kullanıcı'
  };
};

// FIX: Refactored the component to use its own lifecycle hooks for mounting/unmounting React.
// This avoids the TypeScript error with using the Mithril-specific `oncreate` attribute in JSX
// which was being type-checked against React's definitions.
export default class TeacherRatingsPage extends Page {
    private reactRoot: ReactDOM.Root | null = null;
    
    oncreate(vnode: any) {
        super.oncreate?.(vnode);

        const container = vnode.dom;
        if (container) {
            this.reactRoot = ReactDOM.createRoot(container);
            
            const flarumUser = app.session.user;
            const currentUser = adaptFlarumUser(flarumUser);
            const isAdmin = flarumUser ? flarumUser.isAdmin() : false;
            
            this.reactRoot.render(<App currentUser={currentUser} isAdmin={isAdmin} />);
        }
    }

    onremove(vnode: any) {
        super.onremove?.(vnode);

        this.reactRoot?.unmount();
        this.reactRoot = null;
    }

    view() {
        // This key ensures the component re-mounts when the user logs in/out
        const sessionKey = app.session.user ? app.session.user.id() : 'logged-out';

        // The React app will be rendered inside this div via the oncreate hook.
        return (
            <div className="TeacherRatingsPage" key={sessionKey}>
            </div>
        );
    }
}
