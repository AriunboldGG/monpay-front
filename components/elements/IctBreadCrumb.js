// import { useRouter } from 'next/router';
// import { Breadcrumb } from 'react-bootstrap';
// import { ictTrimSlashes, ictRmMultiSlashes } from 'lib/Functions';

// function IctBreadCrumb(props) {
//     const { breadcrumbList } = props;
//     const { asPath } = useRouter();
//     const $asPath = ictTrimSlashes(ictRmMultiSlashes(asPath));
//     return (
//         <Breadcrumb className="tw-breadcrumb">
//             {breadcrumbList.map((breadcrumb) => {
//                 const url = breadcrumb.url
//                     ? ictTrimSlashes(ictRmMultiSlashes(breadcrumb.url))
//                     : '';
//                 return breadcrumb.name ? (
//                     <Breadcrumb.Item
//                         key={breadcrumb.position}
//                         href={'/' + url}
//                         active={$asPath === url}
//                     >
//                         {breadcrumb.name}
//                     </Breadcrumb.Item>
//                 ) : null;
//             })}
//         </Breadcrumb>
//     );
// }
// export default IctBreadCrumb;
