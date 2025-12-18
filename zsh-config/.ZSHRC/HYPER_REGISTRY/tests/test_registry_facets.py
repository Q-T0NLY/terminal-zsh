import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from src.core.registry_engine import FeatureFlag, FeatureLayer, HyperRegistry


class RegistryFacetTests(unittest.TestCase):
    def setUp(self):
        self.registry = HyperRegistry()

    def test_register_feature_layer_and_search_by_facet(self):
        layer = FeatureLayer(
            id="vision-layer",
            name="Vision Classification",
            namespace="nexuspro.layers",
            version="1.0.0",
            description="Vision feature layer",
            features=[FeatureFlag(id="feat-vision", name="Vision Feature")],
            facets={"domain": ["vision", "ml"], "stage": ["beta"]},
        )
        entry = self.registry.register_feature_layer(layer, owner="tester")

        by_domain = self.registry.search(facets={"domain": "vision"})
        self.assertEqual(len(by_domain), 1)
        self.assertEqual(by_domain[0].id, entry.id)

        by_stage = self.registry.search(facets={"stage": ["beta"]})
        self.assertEqual(len(by_stage), 1)
        self.assertEqual(by_stage[0].id, entry.id)

        missing = self.registry.search(facets={"domain": "audio"})
        self.assertEqual(len(missing), 0)

    def test_facet_filter_combines_with_namespace_and_multiple_facets(self):
        # Layer A: matches all filters
        layer_a = FeatureLayer(
            id="layer-a",
            name="Layer A",
            namespace="alpha.ns",
            facets={"domain": ["ml"], "stage": ["ga"]},
            features=[FeatureFlag(id="feat-a", name="Feature A")],
        )
        entry_a = self.registry.register_feature_layer(layer_a, owner="tester")

        # Layer B: different namespace and stage
        layer_b = FeatureLayer(
            id="layer-b",
            name="Layer B",
            namespace="beta.ns",
            facets={"domain": ["ml"], "stage": ["beta"]},
            features=[FeatureFlag(id="feat-b", name="Feature B")],
        )
        self.registry.register_feature_layer(layer_b, owner="tester")

        results = self.registry.search(
            namespace="alpha.ns", facets={"domain": "ml", "stage": "ga"}
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].id, entry_a.id)

        # Ensure the namespace filter excludes layer_b even if facets overlap
        results_beta_ns = self.registry.search(namespace="beta.ns", facets={"domain": "ml"})
        self.assertEqual(len(results_beta_ns), 1)
        self.assertNotEqual(results_beta_ns[0].id, entry_a.id)


if __name__ == "__main__":
    unittest.main()
