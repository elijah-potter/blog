import type { GetServerSideProps } from "next";
import generateRSS from "../src/generateRSS";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	if (res) {
		res
			.setHeader("Content-Type", "text/xml")
			.setHeader(
				"Cache-Control",
				"public, s-maxage=7200, stale-while-revalidate=59",
			)
			.write(await generateRSS());
		res.end();
	}

	return {
		props: {},
	};
};

export default function () {
	return <></>;
}
