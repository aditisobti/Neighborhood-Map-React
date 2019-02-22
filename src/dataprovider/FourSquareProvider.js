export const getFourSquareDetails = (lat, long) => {
    var clientId = "ZLTB54GMU15Z35JJLT40TONX3UCMK3Q4CTSPMES05UMOAVH0";
    var clientSecret = "CVE0PWNVSK53XK4KWDV1AUIRJISOJTNJKGQ00OUOWIIIOB0P";
    var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + lat + "," + long + "&limit=1";
    return (
        fetch(url)
            .then(res => res)
    );
}
