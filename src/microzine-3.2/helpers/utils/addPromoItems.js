export const addPromoItems = (articles, sortedCollections) => {
  let mixedContent = [];
  let articleItr = 0;
  articles.forEach(article => {
    let addingPromos = sortedCollections.length > 0 ? true : false;
    let promosAdded = 0;
    /* eslint-disable no-loop-func*/
    while (addingPromos) {
      sortedCollections.forEach(staticCollection => {
        let len = staticCollection.articles.length;
        let count = staticCollection.count;
        if (
          articleItr === staticCollection.pos ||
          articleItr + promosAdded === staticCollection.pos
        ) {
          //only clone the articles needed on the first load. After you have the count just pull from the pool.
          let promo = null;
          if (promosAdded) {
            //the first one is actually not used as it was cloned off of.
            promo = staticCollection.articlePool[count];
          } else {
            promo = staticCollection.articles[count % len].clone();
            staticCollection.articlePool.push(promo);
          }
          mixedContent.push(promo);
          staticCollection.count++;
          staticCollection.pos += staticCollection.frequency;
          promosAdded++;
          addingPromos = true;
        } else {
          addingPromos = false;
        }
      });

      articleItr += promosAdded;
      promosAdded = 0;
    }
    /* eslint-enable no-loop-func*/
    mixedContent.push(article);
    articleItr++;
  });
  return mixedContent;
};
