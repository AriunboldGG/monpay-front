import React      from "react"
import useTranslation from 'next-translate/useTranslation'

const Search = (props) => {
    const { themeOption } = props;
    const { lang } = useTranslation('common')
    const srchKey = 'search_key_' + lang

    return (
        <section className="tw-row">
            <div className="container">
                <div className="row">
                    <div className="tw-column col">
                        { themeOption&&themeOption[srchKey]&&<script async src={'https://cse.google.com/cse.js?cx=' + ( themeOption[srchKey] )}></script> }
                        <div className="gcse-search"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Search