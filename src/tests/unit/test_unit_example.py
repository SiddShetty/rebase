import beeline
import pytest

from hello_world import handler

# pylint: disable = no-self-use, unused-argument
class TestService:
    the_number_one = 1
    hello = "Hello"

    @pytest.fixture
    def close_beeline(self):
        beeline.close()

    def test_example_unit(self):
        assert self.the_number_one != 2

    def test_hello_world_handler(self, close_beeline):
        assert handler({}, None) == self.hello
