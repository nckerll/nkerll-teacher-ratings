import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';
import TeacherRatingsPage from './pages/TeacherRatingsPage';
import './forum.css';

declare const app: any;

app.initializers.add('nckerll/nkerll-teacher-ratings', () => {
  app.routes['teacher-ratings'] = {
    path: '/teacher-ratings',
    component: TeacherRatingsPage,
  };

  extend(IndexPage.prototype, 'navItems', (items: any) => {
    items.add(
      'teacher-ratings',
      LinkButton.component(
        {
          icon: 'fas fa-chalkboard-teacher',
          href: app.route('teacher-ratings'),
        },
        'Öğretmen Puanlama'
      ),
      5 // Priority to position it below 'All Discussions'
    );
  });
});
