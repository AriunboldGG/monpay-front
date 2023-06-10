import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { Children } from 'react'
import {ictTrimSlashes,ictRmMultiSlashes} from 'lib/Functions'

const IctLink = ({ children, ...props }) => {
  const { asPath } = useRouter()
  const $asPath = '/'+ictTrimSlashes( ictRmMultiSlashes( asPath ) )+'/'
  const activeClassName = props.activeClassName||'active'

  const Container = props.container
  let ContainerClassName = props.containerClassName || ''

  let isActive   =  false
  let hrefCustom = props.hrefCustom ? props.hrefCustom : []
  let isLocalLink = true

  if ( props.href ) {
    if ( props.href.search('https:') >= 0 || props.href.search('http:') >= 0 ) {
      isLocalLink = false
    } else {
      hrefCustom.push( props.href )
    }
  }

  // check is active
  if ( isLocalLink && hrefCustom.length ) {
    hrefCustom.map( crrHrefCus => {
      if ( crrHrefCus ) {
        let crrHref = '/'+ictTrimSlashes( ictRmMultiSlashes( crrHrefCus ) )+'/'
        if ( $asPath.search( crrHref ) >= 0 ) {
          isActive = true
        }
      }
    })
  }

  // remove not used props
  delete props.activeClassName
  delete props.container
  delete props.containerClassName
  delete props.hrefCustom
  delete props.key
  delete props.className

  // Build Link
  const childs = Children.map(children, function( child ){
    if ( child && child.type == 'a' ) {
      let aProps=child.props.className?{className:child.props.className}:{}
      if ( !Container && isActive ) {
        aProps.className=(aProps.className?`${aProps.className} ${activeClassName}`:activeClassName).trim()
      }
      aProps.className=aProps.className?aProps.className:null
      if ( typeof props.prefetch == 'undefined' ) {
        props.prefetch = false
      }
      return isLocalLink?<Link{...props}>{React.cloneElement(child, aProps)}</Link>:React.cloneElement(child, { ...aProps, href: props.href } )
    }
    return child
  });

  // return Link
  if ( Container ) {
    if ( isActive && ContainerClassName!=activeClassName ) {
      ContainerClassName=`${ContainerClassName} ${activeClassName}`.trim()
    }
    return(
      <Container className={ContainerClassName?ContainerClassName:null}>{childs}</Container>
    )
  }

  return <>{childs}</>
}
export default IctLink