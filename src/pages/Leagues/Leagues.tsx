import React, {
  FunctionComponent,
  MouseEvent,
  useState,
  useEffect,
  useRef,
  useContext
} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { LEAGUES_QUERY, LeaguesQueryData } from '../../graphql/queries/Leagues';
import { League } from '../../graphql/generated/types';
import { withRouter, RouteComponentProps } from 'react-router';

// Contexts
import { LocalizationContext } from '../../state/localization/context';
import { MenuContext } from '../../state/menu/context';
import { ApplicationContext } from '../../state/application/context';

// UI components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

// Custom Components
import LeagueForm from '../League/LeagueForm';
import LeaguesList from '../../components/LeaguesList';

// Icons
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';

// Styles
import useStyles from './LeaguesStyles';

type Props = RouteComponentProps<{}>;

const Leagues: FunctionComponent<Props> = ({ history }) => {
  const localizationContext = useContext(LocalizationContext);
  const { localize } = localizationContext;
  const menuContext = useContext(MenuContext);
  const { toggleMenu } = menuContext;
  const applicationContext = useContext(ApplicationContext);
  const { showLeaguesSecondaryList } = applicationContext;
  const classes = useStyles();
  const listMounted = useRef<boolean>(false);
  const [isNewLeagueOpen, setIsNewLeagueOpen] = useState(false);
  const [loadLeaguesQuery, { loading, error, data }] = useLazyQuery<
    LeaguesQueryData
  >(LEAGUES_QUERY, { fetchPolicy: 'cache-and-network' });

  const onLeagueClick = (e: MouseEvent, league: League) => {
    e.stopPropagation();
    history.push(`/league/${league._id}`);
  };

  const handleDrawerOpen = () => {
    toggleMenu();
  };

  const onAddClick = () => {
    setIsNewLeagueOpen(true);
  };

  const onNewLeagueFormClose = () => {
    setIsNewLeagueOpen(false);
  };

  const onLeagueSaved = () => {
    loadLeaguesQuery();
  };

  useEffect(() => {
    if (!listMounted.current) {
      listMounted.current = true;
      loadLeaguesQuery();
      return;
    }
  });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {localize('pages.home.title')}
          </Typography>
          <div className={classes.grow} />
          <IconButton
            color="inherit"
            aria-label="add league"
            onClick={onAddClick}
            edge="end"
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <LeagueForm
        isOpen={isNewLeagueOpen}
        onClose={onNewLeagueFormClose}
        onLeagueSaved={onLeagueSaved}
      />
      {loading && <LinearProgress />}
      {!loading && error ? <p>Error</p> : <></>}
      <div className={classes.grow}>
        <Grid container spacing={1}>
          <Grid item xs={showLeaguesSecondaryList ? 6 : 12}>
            <List>
              {data &&
                data.leagues.map(l => (
                  <ListItem
                    key={l._id}
                    button
                    onClick={e => {
                      onLeagueClick(e, l);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar alt="logo" />
                    </ListItemAvatar>
                    <ListItemText primary={l.name} secondary={l.country} />
                  </ListItem>
                ))}
            </List>
          </Grid>
          {showLeaguesSecondaryList && (
            <Grid item xs={6}>
              <LeaguesList fetchPolicy={'cache-only'} />
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default withRouter(Leagues);