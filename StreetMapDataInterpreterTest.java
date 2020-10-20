package com.codingcompetition.statefarm;

import com.codingcompetition.statefarm.model.PointOfInterest;
import org.hamcrest.*;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

public class StreetMapDataInterpreterTest {

    private Interpreter smallMetro;
    private Interpreter largeMetro;

    @Before
    public void setup() throws Exception {
        smallMetro = new StreetMapDataInterpreter("/small-metro.xml");
        largeMetro = new StreetMapDataInterpreter("/large-metro.xml");
    }

    @Test
    public void canAcceptDataFile() throws Exception {

        StreetMapDataInterpreter interpreter = new StreetMapDataInterpreter("/small-metro.xml");
        MatcherAssert.assertThat(interpreter, notNullValue());

    }

    @Test
    public void canInterpretSmallMetro() throws Exception {

        List<PointOfInterest> interpretedData = smallMetro.interpret();
        MatcherAssert.assertThat(interpretedData.size(), equalTo(78848));

    }

    @Test
    public void canInterpretLargeMetro() throws Exception {

        List<PointOfInterest> interpretedData = largeMetro.interpret();
        MatcherAssert.assertThat(interpretedData.size(), equalTo(116134));

    }
    @Test
    public void returnsEmptyListWhenNullPassedIn() throws Exception {
        SearchCriteria nullCriteria = null;
        List<PointOfInterest> points = smallMetro.interpret(nullCriteria);
        assertThat(points.size(), equalTo(0));

    }

    @Test
    public void canSearchWithSingleSearchCriteria() throws Exception {
        SearchCriteria criteria = buildSearchCriteria(Category.NAME, "Wendy's");
        List<PointOfInterest> interpretedData = smallMetro.interpret(criteria);

        assertEquals(1, interpretedData.size());
        final PointOfInterest returnedPointOfInterest = interpretedData.stream().findFirst().get();

        assertThat(returnedPointOfInterest, notNullValue());

        assertThat(returnedPointOfInterest.getDescriptors().keySet(), hasItems("amenity", "name"));
        assertThat(returnedPointOfInterest.getDescriptors().values(), hasItems("fast_food", "Wendy's"));

    }

    @Test
    public void findCriteriasFunctionsWithOne() throws Exception {
        List<SearchCriteria> searchCriterias = new ArrayList<>();
        Map<Category, String> criterias = null;
        SearchCriteria criteria;

        searchCriterias.add(buildSearchCriteria(Category.NAME, "Wendy's"));

        List<PointOfInterest> interpretedData = smallMetro.findByCriterias(searchCriterias);
        assertEquals(1, interpretedData.size());
        final PointOfInterest returnedPointOfInterest = interpretedData.stream().findFirst().get();
        assertThat(returnedPointOfInterest, notNullValue());
        assertThat(returnedPointOfInterest.getDescriptors().keySet(), hasItems("amenity", "name"));
        assertThat(returnedPointOfInterest.getDescriptors().values(), hasItems("fast_food", "Wendy's"));

    }

    @Test
    public void canSearchByAmenityType() throws Exception {
        List<SearchCriteria> searchCriterias = new ArrayList<SearchCriteria>();

        searchCriterias.add(buildSearchCriteria(Category.AMENITY, "place_of_worship"));

        List<PointOfInterest> interpretedData = smallMetro.findByCriterias(searchCriterias);
        assertThat(interpretedData, notNullValue());
        assertThat(interpretedData.size(), is(44));
        for (PointOfInterest point : interpretedData) {
            assertThat(point.getDescriptors().keySet(), hasItem("amenity"));
            assertThat(point.getDescriptors().get("amenity"), equalTo("place_of_worship"));

        }

    }

    @Test
    public void canBringBackPointsOfInterestWithMultipleSearchCriteria() throws Exception {

        List<SearchCriteria> searchCriterias = new ArrayList<SearchCriteria>();
        Map<Category, String> criterias = new HashMap<Category, String>();
        criterias.put(Category.NAME, "Wendy's");
        searchCriterias.add(buildSearchCriteria(Category.NAME, "Wendy's"));
        searchCriterias.add(buildSearchCriteria(Category.AMENITY, "place_of_worship"));
        searchCriterias.add(buildSearchCriteria(Category.BEAUTY, "nails"));

        List<PointOfInterest> interpretedData = smallMetro.findByCriterias(searchCriterias);
        assertEquals(46, interpretedData.size());

    }

    @Test
    public void doesNotBringBackTheSamePointOfInterestTwiceWhenThereIsOnlyOne() throws Exception {
        SearchCriteria criteriaAmenity = buildSearchCriteria(Category.AMENITY, "fast_food");
        SearchCriteria criteria = buildSearchCriteria(Category.NAME, "Wendy's");
        List<SearchCriteria> criterias = new ArrayList<>();
        criterias.add(criteria);
        criterias.add(criteriaAmenity);
        StreetMapDataInterpreter interpreter = new StreetMapDataInterpreter("/small-metro.xml");
        List<PointOfInterest> interpretedData = smallMetro.findByCriterias(criterias);

        assertThat(interpretedData.size(), equalTo(17));

        List<PointOfInterest> wendys = interpretedData.stream().filter(pointOfInterest -> {
            return pointOfInterest.getDescriptors().get("name").equals("Wendy's");
        }).collect(Collectors.toList());

        assertEquals(1, wendys.size());
    }

    @Test
    public void willBringBackMultipleInstancesWhenMoreThanOneExist() throws Exception {
        SearchCriteria criteria = buildSearchCriteria(Category.NAME, "McDonald's");
        List<SearchCriteria> criterias = new ArrayList<>();
        criterias.add(criteria);
        List<PointOfInterest> interpretedData = largeMetro.findByCriterias(criterias);

        assertThat(interpretedData.size(), equalTo(11));

    }

    @Test
    public void canFilterCritieriaBasedOnPriority() throws Exception {

        SearchCriteria firstFilter = buildSearchCriteria(Category.AMENITY, "fast_food");
        SearchCriteria secondFilter = buildSearchCriteria(Category.NAME, "Wendy's");
        Map<Integer, SearchCriteria> filteringCriteria = new HashMap<>();
        filteringCriteria.put(1, firstFilter);
        filteringCriteria.put(2, secondFilter);

        List<PointOfInterest> interpretedData = smallMetro.interpret(filteringCriteria);
        assertEquals(1, interpretedData.size());
        final PointOfInterest returnedPointOfInterest = interpretedData.stream().findFirst().get();
        assertThat(returnedPointOfInterest, notNullValue());
        assertThat(returnedPointOfInterest.getDescriptors().keySet(), hasItems("amenity", "name"));
        assertThat(returnedPointOfInterest.getDescriptors().values(), hasItems("fast_food", "Wendy's"));

    }

    @Test
    public void canFilterWithStartsWithLogic() throws Exception {
        SearchCriteria filter = buildSearchCriteria(Category.NAMESTARTSWITH, "M");
        List<PointOfInterest> interpretedData = smallMetro.interpret(filter);
        assertEquals(21, interpretedData.size());
        interpretedData.forEach(pointOfInterest -> {
            assertThat(pointOfInterest.getDescriptors().get("name").charAt(0), equalTo('M'));
        });

    }

    @Test
    public void canFilterWithEndsWithLogic() throws Exception {
        SearchCriteria filter = buildSearchCriteria(Category.NAMEENDSWITH, "'s");
        List<PointOfInterest> interpretedData = smallMetro.interpret(filter);
        assertEquals(14, interpretedData.size());
        interpretedData.forEach(pointOfInterest -> {
            assertThat(pointOfInterest.getDescriptors().get("name").substring(pointOfInterest.getDescriptors().get("name").length() - 2), equalTo("'s"));
        });

    }

    @Test
    public void canFilterRankedWithEndsWithLogic() throws Exception {
        SearchCriteria firstFilter = buildSearchCriteria(Category.AMENITY, "fast_food");
        SearchCriteria secondFilter = buildSearchCriteria(Category.NAMEENDSWITH, "'s");
        Map<Integer, SearchCriteria> filteringCriteria = new HashMap<>();
        filteringCriteria.put(1, firstFilter);
        filteringCriteria.put(2, secondFilter);
        List<PointOfInterest> interpretedData = smallMetro.interpret(filteringCriteria);
        assertEquals(8, interpretedData.size());
        interpretedData.forEach(pointOfInterest -> {
            assertThat(pointOfInterest.getDescriptors().get("name").substring(pointOfInterest.getDescriptors().get("name").length() - 2), equalTo("'s"));
        });

    }

    private SearchCriteria buildSearchCriteria(Category cat, String value) {
        SearchCriteria criteria = new SearchCriteria(cat, value);
        return criteria;
    }

}


