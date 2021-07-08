import lambdas_test


class TestService(lambdas_test.TestCase):
    def setUp(self):
        self._test = True

    def tearDown(self):
        pass

    def test_example_lambda(self):
        self.assertTrue(self._test)
