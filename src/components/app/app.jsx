import './app.css';
import { Layout, Modal, Typography, Row } from 'antd';
import React, { Suspense, useState } from 'react';
import { useLocation, useHistory, withRouter, NavLink } from 'react-router-dom';
import MyContext from '../../servises/Context';
import Loader from '../loader';
import SearchBox from '../search-box';
import MenuSider from '../menu-sider';
import MovieContainer from '../movie-container';
import Error from '../error';
import getFromLocalStorage from '../../servises/getFromLocalStorage';
import defGenres from '../../servises/defGenres';

const MovieDetail = React.lazy(() => import('../movie-detail'))

const { Text } = Typography
const { Header, Content, Footer, Sider } = Layout;
//const API_KEY = 'eb9d8a81';
//const API_KEY = 'a6a004a3'

function App() {

  const history = useHistory()
  let location = useLocation().pathname.split('/')[1];

  let queryStr = useLocation().pathname.split('query=')[1]
  let query = queryStr !== undefined && queryStr.split('/')[0]

  let urlPageStr = useLocation().pathname.split('page=')[1]
  let urlPage = urlPageStr !== undefined && urlPageStr.split('/')[0]

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState(query);

  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false); //ответ от сервера

  const [favList, setFav] = useState(() => { return getFromLocalStorage('fav') });
  const [watchList, setWatch] = useState(() => { return getFromLocalStorage('watch') });

  const [collapsedMenu, setCollapsedMenu] = useState(false);

  const [currPage, setCurrPage] = useState(urlPage || 1)
  const [totalResults, setTotalResults] = useState(null);

  const [genreList, setGenreList] = useState(() => { return defGenres(location) });
  const [yearValue, setYearValue] = useState(null)

  const data = { movie, error, setError, watchList, favList, setWatch, setFav, history, location, q, setQuery, setGenreList, setMovie, setLoading, setTotalResults, setActivateModal, setDetailRequest, setShowDetail, setCurrPage, genreList, yearValue, currPage, totalResults }

  const titleLogo = <svg width="200" height="70" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.7656 13.9863H38.1553V33H35.4746V13.9863H29.8789V11.6719H43.7656V13.9863ZM48.2416 18.7764C49.2279 17.4971 50.4877 16.8574 52.0209 16.8574C54.8236 16.8574 56.2445 18.7275 56.2836 22.4678V33H53.7055V22.585C53.7055 21.3447 53.4955 20.4658 53.0756 19.9482C52.6654 19.4209 52.0453 19.1572 51.2152 19.1572C50.5707 19.1572 49.9896 19.3721 49.4721 19.8018C48.9643 20.2314 48.5541 20.793 48.2416 21.4863V33H45.6488V10.5H48.2416V18.7764ZM64.9197 33.293C62.9471 33.293 61.4334 32.707 60.3787 31.5352C59.324 30.3535 58.7869 28.625 58.7674 26.3496V24.4307C58.7674 22.0674 59.2801 20.2168 60.3055 18.8789C61.3406 17.5312 62.7811 16.8574 64.6268 16.8574C66.4822 16.8574 67.8689 17.4482 68.7869 18.6299C69.7049 19.8115 70.1736 21.6523 70.1932 24.1523V25.8516H61.3455V26.2178C61.3455 27.917 61.6629 29.1523 62.2977 29.9238C62.9422 30.6953 63.865 31.0811 65.0662 31.0811C65.8279 31.0811 66.4969 30.9395 67.073 30.6562C67.659 30.3633 68.2059 29.9043 68.7137 29.2793L70.0613 30.9199C68.9383 32.502 67.2244 33.293 64.9197 33.293ZM64.6268 19.084C63.5525 19.084 62.7566 19.4551 62.2391 20.1973C61.7215 20.9297 61.4285 22.0723 61.3602 23.625H67.6004V23.2734C67.532 21.7695 67.2586 20.6953 66.7801 20.0508C66.3113 19.4062 65.5936 19.084 64.6268 19.084Z" fill="#FFD500" />
    <path d="M152.523 51.3145C152.523 53.6204 152.109 55.3568 151.279 56.5234C150.45 57.6901 149.247 58.2734 147.67 58.2734C146.102 58.2734 144.926 57.599 144.143 56.25L144.02 58H141.818V37H144.225V44.834C145.018 43.5671 146.157 42.9336 147.643 42.9336C149.265 42.9336 150.482 43.5078 151.293 44.6562C152.104 45.8047 152.514 47.5365 152.523 49.8516V51.3145ZM150.117 49.9336C150.117 48.1836 149.871 46.9395 149.379 46.2012C148.896 45.4538 148.107 45.0801 147.014 45.0801C145.765 45.0801 144.835 45.7546 144.225 47.1035V54.1445C144.826 55.4753 145.765 56.1406 147.041 56.1406C148.135 56.1406 148.919 55.7578 149.393 54.9922C149.867 54.2266 150.108 53.0371 150.117 51.4238V49.9336ZM162.389 58C162.243 57.681 162.138 57.1432 162.074 56.3867C161.217 57.6445 160.124 58.2734 158.793 58.2734C157.453 58.2734 156.405 57.8997 155.648 57.1523C154.901 56.3958 154.527 55.334 154.527 53.9668C154.527 52.4629 155.038 51.2689 156.058 50.3848C157.079 49.5007 158.478 49.0495 160.256 49.0312H162.033V47.459C162.033 46.5749 161.837 45.946 161.445 45.5723C161.053 45.1986 160.456 45.0117 159.654 45.0117C158.925 45.0117 158.333 45.2305 157.877 45.668C157.421 46.0964 157.193 46.6432 157.193 47.3086H154.773C154.773 46.5521 154.997 45.832 155.443 45.1484C155.89 44.4557 156.491 43.9134 157.248 43.5215C158.004 43.1296 158.847 42.9336 159.777 42.9336C161.29 42.9336 162.439 43.3118 163.222 44.0684C164.015 44.8158 164.421 45.9095 164.439 47.3496V54.8145C164.448 55.9538 164.603 56.9427 164.904 57.7812V58H162.389ZM159.162 56.0723C159.754 56.0723 160.32 55.9082 160.857 55.5801C161.395 55.252 161.787 54.8418 162.033 54.3496V50.8223H160.666C159.517 50.8405 158.611 51.1003 157.945 51.6016C157.28 52.0938 156.947 52.7865 156.947 53.6797C156.947 54.5182 157.116 55.1289 157.453 55.5117C157.79 55.8854 158.36 56.0723 159.162 56.0723ZM174.55 54.2129C174.55 53.6934 174.355 53.2467 173.963 52.873C173.571 52.4993 172.814 52.0618 171.693 51.5605C170.39 51.0228 169.469 50.5625 168.931 50.1797C168.403 49.7969 168.006 49.3639 167.742 48.8809C167.478 48.3887 167.345 47.8053 167.345 47.1309C167.345 45.9277 167.783 44.9297 168.658 44.1367C169.542 43.3346 170.668 42.9336 172.035 42.9336C173.475 42.9336 174.632 43.3529 175.507 44.1914C176.382 45.0299 176.82 46.1055 176.82 47.418H174.414C174.414 46.7526 174.19 46.1875 173.744 45.7227C173.297 45.2487 172.728 45.0117 172.035 45.0117C171.324 45.0117 170.763 45.1986 170.353 45.5723C169.952 45.9368 169.752 46.429 169.752 47.0488C169.752 47.541 169.897 47.9375 170.189 48.2383C170.49 48.5391 171.205 48.9355 172.336 49.4277C174.131 50.1296 175.353 50.8177 176 51.4922C176.647 52.1576 176.97 53.0052 176.97 54.0352C176.97 55.3203 176.528 56.3503 175.644 57.125C174.76 57.8906 173.575 58.2734 172.09 58.2734C170.549 58.2734 169.3 57.8314 168.343 56.9473C167.386 56.0632 166.908 54.9421 166.908 53.584H169.341C169.369 54.4043 169.619 55.0469 170.093 55.5117C170.567 55.9766 171.233 56.209 172.09 56.209C172.892 56.209 173.502 56.0312 173.922 55.6758C174.341 55.3112 174.55 54.8236 174.55 54.2129ZM184.58 58.2734C182.738 58.2734 181.326 57.7266 180.341 56.6328C179.357 55.5299 178.856 53.9167 178.837 51.793V50.002C178.837 47.7962 179.316 46.069 180.273 44.8203C181.239 43.5625 182.584 42.9336 184.306 42.9336C186.038 42.9336 187.332 43.485 188.189 44.5879C189.046 45.6908 189.483 47.4089 189.501 49.7422V51.3281H181.244V51.6699C181.244 53.2559 181.54 54.4089 182.132 55.1289C182.734 55.849 183.595 56.209 184.716 56.209C185.427 56.209 186.052 56.0768 186.589 55.8125C187.136 55.5391 187.647 55.1107 188.121 54.5273L189.378 56.0586C188.33 57.5352 186.731 58.2734 184.58 58.2734ZM184.306 45.0117C183.304 45.0117 182.561 45.3581 182.078 46.0508C181.595 46.7344 181.321 47.8008 181.257 49.25H187.082V48.9219C187.018 47.5182 186.763 46.5156 186.316 45.9141C185.878 45.3125 185.209 45.0117 184.306 45.0117Z" fill="#FFD500" />
    <path d="M133.3 34V12.6719H138.383C140.873 12.6719 142.807 13.4531 144.184 15.0156C145.561 16.5684 146.249 18.7559 146.249 21.5781V25.1523C146.249 27.9746 145.551 30.1572 144.154 31.7002C142.758 33.2334 140.731 34 138.075 34H133.3ZM135.98 14.9863V31.7002H138.134C140.019 31.7002 141.396 31.1631 142.265 30.0889C143.134 29.0049 143.578 27.4033 143.598 25.2842V21.5049C143.598 19.2588 143.163 17.6133 142.294 16.5684C141.435 15.5137 140.131 14.9863 138.383 14.9863H135.98ZM157.331 34C157.175 33.6582 157.063 33.082 156.995 32.2715C156.077 33.6191 154.905 34.293 153.479 34.293C152.043 34.293 150.92 33.8926 150.11 33.0918C149.309 32.2812 148.909 31.1436 148.909 29.6787C148.909 28.0674 149.455 26.7881 150.549 25.8408C151.643 24.8936 153.142 24.4102 155.046 24.3906H156.951V22.7061C156.951 21.7588 156.741 21.085 156.321 20.6846C155.901 20.2842 155.261 20.084 154.402 20.084C153.621 20.084 152.986 20.3184 152.497 20.7871C152.009 21.2461 151.765 21.832 151.765 22.5449H149.172C149.172 21.7344 149.412 20.9629 149.89 20.2305C150.369 19.4883 151.013 18.9072 151.824 18.4873C152.634 18.0674 153.538 17.8574 154.534 17.8574C156.155 17.8574 157.385 18.2627 158.225 19.0732C159.075 19.874 159.509 21.0459 159.529 22.5889V30.5869C159.538 31.8076 159.704 32.8672 160.027 33.7656V34H157.331ZM153.874 31.9346C154.509 31.9346 155.115 31.7588 155.691 31.4072C156.267 31.0557 156.687 30.6162 156.951 30.0889V26.3096H155.486C154.255 26.3291 153.284 26.6074 152.571 27.1445C151.858 27.6719 151.501 28.4141 151.501 29.3711C151.501 30.2695 151.682 30.9238 152.043 31.334C152.405 31.7344 153.015 31.9346 153.874 31.9346ZM166.055 14.3125V18.1504H168.443V20.2451H166.055V30.0742C166.055 30.6992 166.158 31.1729 166.363 31.4951C166.568 31.8174 166.92 31.9785 167.418 31.9785C167.76 31.9785 168.106 31.9199 168.458 31.8027L168.429 34C167.843 34.1953 167.242 34.293 166.627 34.293C165.601 34.293 164.82 33.9268 164.283 33.1943C163.746 32.4619 163.477 31.4268 163.477 30.0889V20.2451H161.06V18.1504H163.477V14.3125H166.055ZM178.793 34C178.637 33.6582 178.525 33.082 178.456 32.2715C177.538 33.6191 176.366 34.293 174.941 34.293C173.505 34.293 172.382 33.8926 171.571 33.0918C170.771 32.2812 170.37 31.1436 170.37 29.6787C170.37 28.0674 170.917 26.7881 172.011 25.8408C173.105 24.8936 174.604 24.4102 176.508 24.3906H178.412V22.7061C178.412 21.7588 178.202 21.085 177.782 20.6846C177.362 20.2842 176.723 20.084 175.863 20.084C175.082 20.084 174.447 20.3184 173.959 20.7871C173.471 21.2461 173.227 21.832 173.227 22.5449H170.634C170.634 21.7344 170.873 20.9629 171.352 20.2305C171.83 19.4883 172.475 18.9072 173.285 18.4873C174.096 18.0674 174.999 17.8574 175.995 17.8574C177.616 17.8574 178.847 18.2627 179.687 19.0732C180.536 19.874 180.971 21.0459 180.99 22.5889V30.5869C181 31.8076 181.166 32.8672 181.488 33.7656V34H178.793ZM175.336 31.9346C175.971 31.9346 176.576 31.7588 177.153 31.4072C177.729 31.0557 178.149 30.6162 178.412 30.0889V26.3096H176.947C175.717 26.3291 174.745 26.6074 174.032 27.1445C173.32 27.6719 172.963 28.4141 172.963 29.3711C172.963 30.2695 173.144 30.9238 173.505 31.334C173.866 31.7344 174.477 31.9346 175.336 31.9346Z" fill="#FFD500" />
    <path d="M84.4664 32.7879C85.4893 33.6166 86.7209 34.0193 87.9455 34.0193C89.5606 34.0193 91.1615 33.3188 92.2551 31.9692C94.1755 29.5955 93.8091 26.1022 91.4367 24.1811C90.2878 23.2504 88.8505 22.8226 87.3721 22.9771C85.9013 23.1316 84.5781 23.8495 83.6467 24.9992C82.7154 26.149 82.2888 27.592 82.4427 29.0631C82.5975 30.534 83.3163 31.8566 84.4664 32.7879ZM85.56 26.5477C86.0769 25.9089 86.8122 25.5099 87.6293 25.424C87.7389 25.4125 87.8481 25.4072 87.9563 25.4072C88.6581 25.4072 89.3335 25.6452 89.8876 26.0935C91.2049 27.1607 91.409 29.1016 90.3418 30.4198C89.2746 31.7387 87.3312 31.9419 86.0142 30.8747C85.376 30.3572 84.9758 29.6225 84.8905 28.8053C84.8052 27.9881 85.0422 27.1865 85.56 26.5477Z" fill="#FFD500" />
    <path d="M109.203 47.6362C107.804 47.155 106.303 47.2463 104.973 47.8953C103.644 48.5437 102.646 49.6708 102.164 51.0697C101.682 52.4686 101.775 53.9714 102.422 55.2999C103.071 56.6296 104.199 57.627 105.597 58.1085C106.188 58.3121 106.797 58.4132 107.405 58.4132C108.234 58.4132 109.06 58.2246 109.828 57.8501C111.157 57.2017 112.155 56.0743 112.637 54.6757C113.119 53.2771 113.026 51.774 112.377 50.4449C111.729 49.1158 110.602 48.118 109.203 47.6362ZM110.309 53.874C110.042 54.6515 109.488 55.2776 108.749 55.6377C108.01 55.9979 107.178 56.0504 106.398 55.7814C105.621 55.514 104.996 54.9599 104.635 54.2215C104.274 53.4831 104.224 52.6482 104.492 51.8714C104.759 51.0939 105.313 50.4678 106.052 50.1076C106.484 49.8961 106.943 49.7965 107.395 49.7965C108.535 49.7965 109.632 50.4322 110.166 51.5239C110.526 52.2626 110.577 53.0972 110.309 53.874Z" fill="#FFD500" />
    <path d="M120.752 39.0844C119.968 37.8297 118.743 36.9561 117.301 36.6226C115.863 36.2922 114.378 36.5385 113.121 37.3225C111.866 38.1068 110.992 39.3319 110.659 40.7733C109.973 43.7483 111.835 46.7275 114.811 47.415C115.227 47.5112 115.644 47.5575 116.056 47.5575C118.576 47.5575 120.862 45.8219 121.452 43.2646C121.784 41.8238 121.536 40.339 120.752 39.0844ZM119.053 42.7114C118.672 44.3632 117.02 45.3957 115.363 45.0172C113.711 44.6349 112.676 42.9795 113.058 41.3265C113.242 40.5261 113.729 39.846 114.426 39.4104C114.921 39.1008 115.48 38.9417 116.049 38.9417C116.281 38.9417 116.516 38.968 116.748 39.0211C117.548 39.2063 118.229 39.6921 118.664 40.3893C119.101 41.0851 119.238 41.9104 119.053 42.7114Z" fill="#FFD500" />
    <path d="M90.2577 40.7733C89.9248 39.3316 89.0512 38.1065 87.7966 37.3225C86.5419 36.5385 85.0565 36.2894 83.6166 36.6229C82.1743 36.9558 80.9485 37.8294 80.1652 39.084C79.3818 40.3387 79.1327 41.8235 79.4656 43.264C80.0556 45.8219 82.3415 47.5568 84.8616 47.5568C85.2727 47.5568 85.6897 47.5112 86.1067 47.4144C89.0825 46.7275 90.944 43.7483 90.2577 40.7733ZM85.5541 45.0162C83.903 45.3997 82.2469 44.3628 81.8647 42.7105C81.6795 41.9101 81.8166 41.0851 82.2528 40.3886C82.6878 39.6915 83.3694 39.2053 84.1695 39.0211C84.4016 38.9674 84.6358 38.9413 84.8679 38.9413C85.4375 38.9413 85.9962 39.1005 86.4914 39.4101C87.1885 39.8457 87.6753 40.5261 87.8589 41.3262C88.2411 42.9792 87.2065 44.6349 85.5541 45.0162Z" fill="#FFD500" />
    <path d="M105.996 22.4605C105.996 19.4068 103.512 16.9226 100.459 16.9226C97.4048 16.9226 94.9207 19.4068 94.9207 22.4605C94.9207 25.5142 97.4048 27.9984 100.459 27.9984C103.512 27.9984 105.996 25.5142 105.996 22.4605ZM100.459 25.5369C98.7615 25.5369 97.3819 24.1566 97.3819 22.4602C97.3819 20.7638 98.7615 19.3835 100.459 19.3835C102.156 19.3835 103.535 20.7638 103.535 22.4602C103.535 24.1566 102.156 25.5369 100.459 25.5369Z" fill="#FFD500" />
    <path d="M112.972 34.0193C114.196 34.0193 115.428 33.6166 116.451 32.7879C117.601 31.8566 118.32 30.534 118.474 29.0625C118.628 27.5916 118.202 26.1481 117.27 24.9986C115.349 22.6262 111.854 22.2604 109.482 24.1802C107.108 26.1018 106.742 29.5955 108.662 31.9689C109.756 33.3184 111.357 34.0193 112.972 34.0193ZM111.03 26.0935C112.35 25.0244 114.29 25.2301 115.357 26.5477C115.875 27.1865 116.112 27.9881 116.026 28.8053C115.941 29.6225 115.541 30.3575 114.903 30.8747C113.582 31.9438 111.644 31.7387 110.575 30.4198C109.508 29.1016 109.713 27.1607 111.03 26.0935Z" fill="#FFD500" />
    <path d="M95.9448 47.8953C94.6145 47.2462 93.1132 47.1544 91.7147 47.6362C90.3161 48.118 89.1886 49.1155 88.5409 50.4449C87.8918 51.7739 87.7994 53.2768 88.2812 54.6757C88.763 56.0746 89.7604 57.2017 91.0898 57.8501C91.8577 58.2246 92.6832 58.4132 93.5128 58.4132C94.1197 58.4132 94.7302 58.3124 95.3203 58.1085C96.7192 57.6273 97.8463 56.6296 98.4941 55.3005C99.1432 53.9714 99.2356 52.4686 98.7538 51.0697C98.272 49.6708 97.2739 48.5434 95.9448 47.8953ZM96.2811 54.2221C95.9219 54.9599 95.2955 55.5139 94.5193 55.7814C93.7406 56.0507 92.9075 55.9976 92.1685 55.6377C91.4295 55.2779 90.8754 54.6518 90.6086 53.874C90.3406 53.0971 90.3912 52.2623 90.7517 51.5239C91.2853 50.4321 92.3826 49.7965 93.5218 49.7965C93.9739 49.7965 94.4327 49.8964 94.8655 50.1076C95.6045 50.4675 96.1586 51.0936 96.4254 51.8714C96.6935 52.6482 96.6429 53.4828 96.2811 54.2221Z" fill="#FFD500" />
    <path d="M139.216 63.5508C139.142 62.8761 138.541 62.384 137.857 62.4638C127.911 63.5549 123.942 52.0935 123.777 51.6049C123.735 51.4799 123.662 51.3772 123.588 51.2763C125.703 47.4755 126.918 43.1082 126.918 38.4586C126.918 23.8693 115.049 12 100.459 12C85.8696 12 74 23.8696 74 38.4586C74 53.0475 85.869 64.9172 100.459 64.9172C109.345 64.9172 117.203 60.4999 122.004 53.7611C123.472 57.0295 127.935 65 136.525 65C137.045 65 137.579 64.9705 138.128 64.9094C138.804 64.8349 139.291 64.2262 139.216 63.5508ZM100.459 62.456C87.2267 62.456 76.4612 51.6908 76.4612 38.4586C76.4612 25.2263 87.2267 14.4612 100.459 14.4612C113.691 14.4612 124.456 25.2263 124.456 38.4586C124.456 51.6908 113.691 62.456 100.459 62.456Z" fill="#FFD500" />
    <path d="M15.373 37.0938L20.5684 53.3359L25.7637 37.0938H28.9902V57H26.4883V49.248L26.7207 41.4824L21.5117 57H19.5977L14.416 41.5371L14.6484 49.248V57H12.1465V37.0938H15.373ZM31.6229 48.9199C31.6229 46.7689 32.1424 45.069 33.1815 43.8203C34.2297 42.5625 35.6105 41.9336 37.3241 41.9336C39.0376 41.9336 40.4139 42.5443 41.453 43.7656C42.5011 44.987 43.0389 46.6504 43.0662 48.7559V50.3145C43.0662 52.4564 42.5467 54.1517 41.5077 55.4004C40.4686 56.6491 39.0832 57.2734 37.3514 57.2734C35.6379 57.2734 34.2616 56.6673 33.2225 55.4551C32.1926 54.2428 31.6593 52.6022 31.6229 50.5332V48.9199ZM34.0428 50.3145C34.0428 51.8366 34.339 53.0352 34.9315 53.9102C35.533 54.776 36.3397 55.209 37.3514 55.209C39.4842 55.209 40.5825 53.6686 40.6463 50.5879V48.9199C40.6463 47.4069 40.3455 46.2129 39.744 45.3379C39.1424 44.4538 38.3358 44.0117 37.3241 44.0117C36.3306 44.0117 35.533 44.4538 34.9315 45.3379C34.339 46.2129 34.0428 47.4023 34.0428 48.9062V50.3145ZM49.322 53.3223L52.1247 42.207H54.5856L50.197 57H48.3923L43.9489 42.207H46.4098L49.322 53.3223ZM58.8726 57H56.4527V42.207H58.8726V57ZM59.064 38.2832C59.064 38.6934 58.9501 39.0352 58.7222 39.3086C58.4943 39.582 58.148 39.7188 57.6831 39.7188C57.2274 39.7188 56.8856 39.582 56.6577 39.3086C56.4299 39.0352 56.3159 38.6934 56.3159 38.2832C56.3159 37.873 56.4299 37.5267 56.6577 37.2441C56.8856 36.9616 57.2274 36.8203 57.6831 36.8203C58.1389 36.8203 58.4807 36.9661 58.7085 37.2578C58.9455 37.5404 59.064 37.8822 59.064 38.2832ZM67.138 57.2734C65.2969 57.2734 63.8841 56.7266 62.8998 55.6328C61.9154 54.5299 61.4141 52.9167 61.3959 50.793V49.002C61.3959 46.7962 61.8744 45.069 62.8314 43.8203C63.7976 42.5625 65.142 41.9336 66.8646 41.9336C68.5964 41.9336 69.8907 42.485 70.7474 43.5879C71.6042 44.6908 72.0417 46.4089 72.0599 48.7422V50.3281H63.8021V50.6699C63.8021 52.2559 64.0983 53.4089 64.6908 54.1289C65.2923 54.849 66.1537 55.209 67.2748 55.209C67.9857 55.209 68.6101 55.0768 69.1478 54.8125C69.6947 54.5391 70.2051 54.1107 70.6791 53.5273L71.9369 55.0586C70.8887 56.5352 69.2891 57.2734 67.138 57.2734ZM66.8646 44.0117C65.862 44.0117 65.1192 44.3581 64.6361 45.0508C64.153 45.7344 63.8796 46.8008 63.8158 48.25H69.64V47.9219C69.5762 46.5182 69.321 45.5156 68.8744 44.9141C68.4369 44.3125 67.767 44.0117 66.8646 44.0117Z" fill="#FFD500" />
  </svg>

  const logo = <svg width="80" height="70" viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.6891 36.2579C24.5383 36.9458 25.5608 37.2802 26.5774 37.2802C27.9182 37.2802 29.2473 36.6986 30.1552 35.5782C31.7495 33.6076 31.4453 30.7075 29.4757 29.1126C28.522 28.3399 27.3287 27.9848 26.1014 28.113C24.8803 28.2413 23.7818 28.8373 23.0086 29.7918C22.2354 30.7463 21.8813 31.9443 22.009 33.1656C22.1375 34.3867 22.7343 35.4847 23.6891 36.2579ZM24.597 31.0773C25.0261 30.547 25.6365 30.2158 26.3149 30.1444C26.4058 30.1349 26.4965 30.1305 26.5864 30.1305C27.169 30.1305 27.7297 30.3281 28.1897 30.7002C29.2833 31.5863 29.4528 33.1976 28.5668 34.2919C27.6808 35.3868 26.0674 35.5555 24.9741 34.6695C24.4443 34.2399 24.112 33.63 24.0412 32.9516C23.9703 32.2732 24.1671 31.6076 24.597 31.0773Z" fill="#FFD500" />
    <path d="M44.225 48.5848C43.0636 48.1853 41.8176 48.261 40.7131 48.7999C39.6097 49.3382 38.7817 50.2739 38.3814 51.4352C37.9812 52.5966 38.0582 53.8442 38.596 54.9471C39.1348 56.051 40.0705 56.8791 41.2319 57.2788C41.7217 57.4478 42.2276 57.5317 42.7324 57.5317C43.4209 57.5317 44.1062 57.3751 44.744 57.0642C45.8474 56.5259 46.6754 55.59 47.0757 54.4289C47.4759 53.2678 47.3989 52.0199 46.8601 50.9165C46.3223 49.8131 45.3863 48.9848 44.225 48.5848ZM45.1429 53.7633C44.9214 54.4088 44.4614 54.9285 43.8479 55.2276C43.2344 55.5266 42.5439 55.5701 41.8964 55.3468C41.2517 55.1248 40.7322 54.6648 40.4326 54.0518C40.1334 53.4388 40.0914 52.7457 40.3139 52.1008C40.5354 51.4553 40.9954 50.9356 41.6089 50.6365C41.9682 50.4609 42.3492 50.3782 42.7244 50.3782C43.6702 50.3782 44.5812 50.9059 45.0242 51.8123C45.3235 52.4256 45.3655 53.1184 45.1429 53.7633Z" fill="#FFD500" />
    <path d="M53.813 41.4851C53.1624 40.4435 52.1447 39.7183 50.9476 39.4414C49.7543 39.1671 48.5211 39.3716 47.4775 40.0224C46.4359 40.6735 45.7106 41.6907 45.4342 42.8873C44.8645 45.357 46.4101 47.8304 48.8804 48.4012C49.2266 48.481 49.5727 48.5194 49.914 48.5194C52.0062 48.5194 53.9039 47.0786 54.3938 44.9555C54.6701 43.7594 54.4636 42.5267 53.813 41.4851ZM52.4023 44.4963C52.086 45.8675 50.715 46.7247 49.3394 46.4105C47.9676 46.0932 47.1084 44.7188 47.4257 43.3465C47.5784 42.682 47.9823 42.1174 48.561 41.7558C48.9721 41.4988 49.436 41.3666 49.9089 41.3666C50.1015 41.3666 50.296 41.3885 50.4886 41.4326C51.1531 41.5863 51.7187 41.9897 52.0798 42.5684C52.4422 43.1461 52.5561 43.8312 52.4023 44.4963Z" fill="#FFD500" />
    <path d="M28.497 42.8873C28.2206 41.6904 27.4953 40.6733 26.4537 40.0224C25.4122 39.3716 24.1789 39.1647 22.9836 39.4416C21.7862 39.718 20.7686 40.4433 20.1182 41.4849C19.4679 42.5264 19.2611 43.7591 19.5374 44.955C20.0273 47.0786 21.925 48.5189 24.0172 48.5189C24.3585 48.5189 24.7046 48.481 25.0508 48.4006C27.5213 47.8304 29.0667 45.357 28.497 42.8873ZM24.5921 46.4097C23.2213 46.728 21.8465 45.8673 21.5292 44.4955C21.3754 43.831 21.4892 43.1461 21.8514 42.5679C22.2125 41.9892 22.7783 41.5856 23.4426 41.4326C23.6352 41.388 23.8297 41.3664 24.0224 41.3664C24.4952 41.3664 24.9591 41.4985 25.3702 41.7556C25.9489 42.1172 26.353 42.682 26.5055 43.3463C26.8228 44.7185 25.9639 46.0931 24.5921 46.4097Z" fill="#FFD500" />
    <path d="M41.5631 27.6842C41.5631 25.149 39.5008 23.0867 36.9656 23.0867C34.4304 23.0867 32.3681 25.149 32.3681 27.6842C32.3681 30.2194 34.4304 32.2817 36.9656 32.2817C39.5008 32.2817 41.5631 30.2194 41.5631 27.6842ZM36.9656 30.2382C35.5567 30.2382 34.4114 29.0923 34.4114 27.6839C34.4114 26.2756 35.5567 25.1297 36.9656 25.1297C38.3745 25.1297 39.5198 26.2756 39.5198 27.6839C39.5198 29.0923 38.3745 30.2382 36.9656 30.2382Z" fill="#FFD500" />
    <path d="M47.3538 37.2802C48.3704 37.2802 49.3932 36.9459 50.2421 36.2579C51.1969 35.4847 51.7937 34.3867 51.9222 33.1651C52.05 31.944 51.6958 30.7456 50.9226 29.7913C49.3273 27.8217 46.4258 27.5181 44.4565 29.1119C42.4859 30.7072 42.1817 33.6076 43.7761 35.578C44.684 36.6983 46.013 37.2802 47.3538 37.2802ZM45.7415 30.7003C46.8379 29.8127 48.4482 29.9835 49.3342 31.0773C49.7644 31.6076 49.9609 32.2732 49.8898 32.9516C49.819 33.63 49.4867 34.2402 48.9569 34.6695C47.8605 35.5571 46.2512 35.3868 45.3642 34.2919C44.4784 33.1976 44.6482 31.5863 45.7415 30.7003Z" fill="#FFD500" />
    <path d="M33.2183 48.7999C32.1139 48.261 30.8676 48.1848 29.7065 48.5848C28.5454 48.9848 27.6094 49.8128 27.0716 50.9165C26.5328 52.0199 26.4561 53.2675 26.8561 54.4289C27.2561 55.5902 28.0841 56.5259 29.1878 57.0642C29.8252 57.3751 30.5106 57.5317 31.1993 57.5317C31.7031 57.5317 32.21 57.448 32.6999 57.2788C33.8612 56.8793 34.7969 56.051 35.3347 54.9476C35.8735 53.8442 35.9503 52.5966 35.5503 51.4352C35.1503 50.2739 34.3217 49.3379 33.2183 48.7999ZM33.4975 54.0523C33.1993 54.6648 32.6793 55.1248 32.0349 55.3468C31.3884 55.5704 30.6968 55.5263 30.0833 55.2276C29.4698 54.9288 29.0098 54.409 28.7883 53.7633C28.5658 53.1184 28.6077 52.4253 28.907 51.8123C29.35 50.9059 30.261 50.3782 31.2068 50.3782C31.5821 50.3782 31.963 50.4611 32.3223 50.6365C32.9358 50.9353 33.3958 51.4551 33.6173 52.1008C33.8398 52.7457 33.7979 53.4385 33.4975 54.0523Z" fill="#FFD500" />
    <path d="M69.1417 61.7969C69.0802 61.2367 68.5813 60.8282 68.0136 60.8944C59.7565 61.8003 56.4612 52.2852 56.3245 51.8795C56.2897 51.7757 56.2289 51.6905 56.1673 51.6068C57.9231 48.4514 58.9317 44.8257 58.9317 40.9656C58.9317 28.8538 49.0782 19 36.9661 19C24.854 19 15 28.854 15 40.9656C15 53.0772 24.8535 62.9312 36.9656 62.9312C44.3427 62.9312 50.8667 59.2641 54.852 53.6696C56.0713 56.383 59.776 63 66.9079 63C67.3391 63 67.7828 62.9755 68.2387 62.9248C68.7994 62.863 69.2036 62.3576 69.1417 61.7969ZM36.9656 60.888C25.9806 60.888 17.0432 51.9509 17.0432 40.9656C17.0432 29.9804 25.9806 21.0432 36.9656 21.0432C47.9506 21.0432 56.888 29.9804 56.888 40.9656C56.888 51.9509 47.9506 60.888 36.9656 60.888Z" fill="#FFD500" />
  </svg>


  return (

    <Layout>

      <Sider
        breakpoint="lg"
        collapsedWidth={70}
        collapsible={true}
        onCollapse={() => setCollapsedMenu(!collapsedMenu)} >

        <div className='logo-sider'>
          <NavLink to={`/start`}
            aria-label="logo"
            onClick={() => {
              setQuery(false);
              setCurrPage(1)
            }}
            className='start-link'
          >
            {collapsedMenu ? logo : titleLogo}
          </NavLink>
        </div>

        <MenuSider
          location={location}
          mode={'inline'}
          icon={true}
          q={q}
          setQuery={setQuery}
          setGenreList={setGenreList}
          setCurrPage={setCurrPage}
        />
      </Sider>

      <Layout className='layout'>

        <Header className='header'>
          <SearchBox
            history={history}
            location={location}
            q={q}
            currPage={currPage}
            setQuery={setQuery}
            genreList={genreList}
            setGenreList={setGenreList}
            yearValue={yearValue}
            setYearValue={setYearValue}
          />
        </Header>

        <Content>

          {loading && <Loader />}

          {error !== null &&
            <Error
              error={error}
              setError={setError}
              setQuery={setQuery}
              setGenreList={setGenreList}
              location={'main'}
              history={history} />
          }

          <MyContext.Provider value={data}>
            <MovieContainer
              history={history}
              location={location}
              urlPage={urlPage}
            />
          </MyContext.Provider>


          <Modal
            centered
            visible={activateModal}
            maskStyle={{ backdropFilter: 'blur(1.0px)' }}
            onCancel={() => { setActivateModal(false); setShowDetail(null) }}
            footer={null}
          >
            <Suspense fallback={<Loader />}>
              {detailRequest === false && detail != null ?
                (<MovieDetail
                  {...detail}
                  isFav={favList.includes(detail) || localStorage.getItem('fav_' + detail.imdbID)}
                  isWatch={watchList.includes(detail) || localStorage.getItem('watch_' + detail.imdbID)} />)
                : (<Loader />)}
            </Suspense>
          </Modal>


        </Content>

        <Footer>
          <MenuSider
            collapsedMenu={false}
            mode={"horizontal"}
            location={location}
            q={q}
            setQuery={setQuery}
            setGenreList={setGenreList}
            setCurrPage={setCurrPage}
          />
          <Row><Text className='author-text'>
            © Viktoryia Nelia 2021
          </Text></Row>
          <Row><Text className='email-text'>
            vikylkinnelya@gmail.com
          </Text></Row>
        </Footer>

      </Layout>
    </Layout>
  )
}

export default withRouter(App);


