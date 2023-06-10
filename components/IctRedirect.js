import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

function IctRedirect( props ) {
    const { link } = props
    const { t, lang } = useTranslation('common')
    const router = useRouter()
    useEffect( () => { link && router.push( link ) }, [] )
    return <div className="ict-preloader">
        <div className="preloader">{ router.locale==='en' ? 'Please Wait ...' : ( router.locale==='ru' ? 'Пожалуйста, подождите ...' : 'Түр хүлээнэ үү ...' )}</div>
    </div>
}
export default IctRedirect;
