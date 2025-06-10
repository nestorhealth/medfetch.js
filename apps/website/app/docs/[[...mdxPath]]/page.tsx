import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from "@/mdx-components";
 
export const generateStaticParams = generateStaticParamsFor('mdxPath')
 
type PageProps = Readonly<{
  params: Promise<{
    mdxPath: string[]
    lang: string
  }>
}>

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}
 
const Wrapper = getMDXComponents().wrapper
 
export default async function DocsPage(props: PageProps) {
  const params = await props.params
  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata } = result
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}