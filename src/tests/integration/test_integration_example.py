import lambdas_test


class TestService(lambdas_test.TestCase):
    def setUp(self):
        self._test = False

    def tearDown(self):
        pass

    def test_example_integration(self):
        self.assertFalse(self._test)
